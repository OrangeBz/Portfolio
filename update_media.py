import os
import json
import re

TARGET_FOLDERS = ["media", "models", "audio", "projects", "images", "visuals", "coding", "programming"]

FILE_TYPES = {
    "images": {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".bmp"},
    "models": {".glb", ".gltf", ".obj", ".fbx"},
    "audio": {".mp3", ".wav", ".ogg", ".flac", ".m4a", ".aac"},
    "video": {".mp4", ".webm", ".mov", ".m4v", ".ogv"}
}

DISCIPLINE_MAP = {
    "illustration": "illustration",
    "illustrations": "illustration",
    "dibujo": "illustration",
    "dibujos": "illustration",
    "animation": "animation",
    "animations": "animation",
    "animacion": "animation",
    "music": "music",
    "musica": "music",
    "audio": "music",
    "textile": "textile",
    "textiles": "textile",
    "textil": "textile",
    "models": "modeling",
    "model": "modeling",
    "modeling": "modeling",
    "3d": "modeling",
    "coding": "programming",
    "programming": "programming",
    "code": "programming",
    "programacion": "programming",
    "programación": "programming",
    "dev": "programming",
    "web": "programming"
}

def get_category_by_ext(extension):
    ext = extension.lower()
    for category, exts in FILE_TYPES.items():
        if ext in exts:
            return category
    return "other"

def detect_discipline(rel_path, category):
    path_lower = rel_path.lower().replace("\\", "/")
    parts = path_lower.split("/")
    for part in parts:
        if part in DISCIPLINE_MAP:
            return DISCIPLINE_MAP[part]
    if category == "models":
        return "modeling"
    if category == "audio":
        return "music"
    return "general"

def parse_filename_metadata(filename):
    """
    Convención de nombres:
    Titulo_Año_Software_Tecnica.ext
    Ejemplo: Dino_2024_Photoshop-ClipStudio_Concept-Art.jpeg
    
    Separadores:
    - '_' separa bloques de datos (Titulo, Año, Software, Tecnica)
    - '-' dentro de un bloque se convierte en espacios
    
    Fallbacks:
    - title: Derivado del nombre (ej: "Dino", "Snow Golem")
    - year: "Desconocido"
    - software: "No especificado"
    - technique: "General / No especificado"
    """
    name_no_ext, ext = os.path.splitext(filename)
    parts = name_no_ext.split("_")
    
    # 1. Título (Bloque 0)
    raw_title = parts[0] if len(parts) > 0 and parts[0].strip() else name_no_ext
    clean_title = raw_title.replace("-", " ")
    clean_title = re.sub(r'([a-z])([A-Z])', r'\1 \2', clean_title).strip()
    title = clean_title.title() if clean_title else "Sin Título"
    
    # 2. Año (Bloque 1)
    if len(parts) > 1 and parts[1].strip():
        year = parts[1].replace("-", " ").strip()
    else:
        year = "Desconocido"
        
    # 3. Software (Bloque 2)
    if len(parts) > 2 and parts[2].strip():
        raw_software = parts[2].replace("-", " ")
        raw_software = re.sub(r'([a-z])([A-Z])', r'\1 \2', raw_software).strip()
        software = raw_software
    else:
        software = "No especificado"
        
    # 4. Técnica (Bloque 3)
    if len(parts) > 3 and parts[3].strip():
        raw_tech = parts[3].replace("-", " ")
        raw_tech = re.sub(r'([a-z])([A-Z])', r'\1 \2', raw_tech).strip()
        technique = raw_tech
    else:
        technique = "General / No especificado"
        
    # 5. Descripción (Bloque 4 sólo si existe en el nombre del archivo, sino vacío)
    if len(parts) > 4 and parts[4].strip():
        description = parts[4].replace("-", " ").strip()
    else:
        description = ""

    return {
        "title": title,
        "year": year,
        "software": software,
        "technique": technique,
        "description": description
    }

def parse_repo_txt(txt_path):
    """
    Lee un archivo .txt en la carpeta coding/ o visuals/coding/ y extrae asociaciones Proyecto -> URL.
    Soporta formatos:
    - Hola www.asdad.com
    - Hola https://github.com/usuario/repo
    - Hola: https://github.com/...
    - Hola = https://...
    - Hola - https://...
    - OrangeBz/MegaBox https://github.com/OrangeBz/MegaBox
    """
    repo_map = {}
    repo_list = []
    if not os.path.exists(txt_path):
        return repo_map, repo_list

    try:
        with open(txt_path, "r", encoding="utf-8", errors="ignore") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                
                # Buscar URL dentro de la línea
                url_match = re.search(r'(https?://[^\s]+|www\.[^\s]+|github\.com/[^\s]+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/[^\s]*)', line)
                if url_match:
                    raw_url = url_match.group(1).strip()
                    key_part = line[:url_match.start()].strip(" :,-=\t")
                    if not key_part:
                        parts = line.split(None, 1)
                        if len(parts) == 2:
                            key_part = parts[0]
                            raw_url = parts[1]

                    url = raw_url
                    if not url.startswith("http://") and not url.startswith("https://"):
                        url = f"https://{url}"

                    if key_part:
                        clean_title = key_part.split("/")[-1].strip() if "/" in key_part else key_part.strip()
                        key_lower = clean_title.lower()
                        repo_map[key_lower] = url
                        clean_k = re.sub(r'[^a-z0-9]', '', key_lower)
                        if clean_k:
                            repo_map[clean_k] = url
                        repo_list.append({
                            "title": clean_title,
                            "url": url,
                            "raw_key": key_part
                        })
                else:
                    parts = line.split(None, 1)
                    if len(parts) == 2:
                        key_part, raw_url = parts[0].strip(" :,-=\t"), parts[1].strip()
                        url = raw_url if raw_url.startswith(("http://", "https://")) else f"https://{raw_url}"
                        clean_title = key_part.split("/")[-1].strip() if "/" in key_part else key_part.strip()
                        key_lower = clean_title.lower()
                        repo_map[key_lower] = url
                        clean_k = re.sub(r'[^a-z0-9]', '', key_lower)
                        if clean_k:
                            repo_map[clean_k] = url
                        repo_list.append({
                            "title": clean_title,
                            "url": url,
                            "raw_key": key_part
                        })
    except Exception as e:
        print(f"Nota leyendo repositorios de {txt_path}: {e}")

    return repo_map, repo_list

def scan_portfolio():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    possible_roots = [
        script_dir,
        os.path.dirname(script_dir)
    ]

    portfolio = {
        "by_discipline": {
            "illustration": [],
            "animation": [],
            "music": [],
            "modeling": [],
            "textile": [],
            "programming": [],
            "general": []
        },
        "images": [],
        "models": [],
        "audio": [],
        "video": [],
        "other": [],
        "by_folder": {},
        "all": []
    }

    scanned_paths = set()

    for base in possible_roots:
        for folder_name in TARGET_FOLDERS:
            folder_dir = os.path.join(base, folder_name)
            if not os.path.exists(folder_dir) or not os.path.isdir(folder_dir):
                continue
            
            real_folder_dir = os.path.realpath(folder_dir)
            if real_folder_dir in scanned_paths:
                continue
            scanned_paths.add(real_folder_dir)

            # 1. Pre-escanear archivos .txt para mapeo de repositorios en este árbol
            repo_mappings = {}
            programming_repos = []
            for root_dir, _, files in os.walk(folder_dir):
                for file in files:
                    if file.lower().endswith(".txt"):
                        txt_path = os.path.join(root_dir, file)
                        rel_txt = os.path.relpath(txt_path, start=base).replace("\\", "/")
                        txt_disc = detect_discipline(rel_txt, "coding")
                        parsed_repos, parsed_list = parse_repo_txt(txt_path)
                        repo_mappings.update(parsed_repos)
                        if txt_disc == "programming":
                            programming_repos.extend(parsed_list)

            # 2. Escanear archivos multimedia
            folder_items = []
            for root_dir, _, files in os.walk(folder_dir):
                for file in files:
                    if file.lower().endswith(".txt"):
                        continue

                    ext = os.path.splitext(file)[1].lower()
                    category = get_category_by_ext(ext)
                    if category == "other":
                        continue
                    
                    # Ruta relativa desde base
                    rel_from_base = os.path.relpath(os.path.join(root_dir, file), start=base).replace("\\", "/")
                    discipline = detect_discipline(rel_from_base, category)
                    
                    # Extraer metadatos dinámicos por convención de nombres
                    meta = parse_filename_metadata(file)

                    # Vincular URL de repositorio si existe coincidencia en el .txt
                    file_no_ext = os.path.splitext(file)[0].lower()
                    clean_name = re.sub(r'[^a-z0-9]', '', file_no_ext)
                    title_lower = meta["title"].lower()
                    clean_title = re.sub(r'[^a-z0-9]', '', title_lower)

                    repo_url = (
                        repo_mappings.get(file_no_ext) or
                        repo_mappings.get(clean_name) or
                        repo_mappings.get(title_lower) or
                        repo_mappings.get(clean_title) or
                        "https://github.com/OrangeBz"
                    )
                    
                    item_data = {
                        "name": file,
                        "title": meta["title"],
                        "year": meta["year"],
                        "software": meta["software"],
                        "technique": meta["technique"],
                        "description": meta["description"],
                        "key": file_no_ext,
                        "path": rel_from_base,
                        "alt_path": f"../{rel_from_base}" if not rel_from_base.startswith("..") else rel_from_base,
                        "category": category,
                        "discipline": discipline,
                        "ext": ext.replace(".", ""),
                        "folder": folder_name,
                        "repo_url": repo_url
                    }
                    
                    # Clasificar por disciplina
                    if discipline in portfolio["by_discipline"]:
                        portfolio["by_discipline"][discipline].append(item_data)
                    else:
                        portfolio["by_discipline"]["general"].append(item_data)

                    # Clasificar por tipo de medio
                    if category in portfolio:
                        portfolio[category].append(item_data)
                    else:
                        portfolio["other"].append(item_data)
                    
                    folder_items.append(item_data)
                    portfolio["all"].append(item_data)

            # 3. Repositorios de Programación que no tengan imagen propia (exclusivamente de coding/programming)
            if programming_repos:
                existing_prog_keys = {
                    re.sub(r'[^a-z0-9]', '', item.get("title", "").lower())
                    for item in portfolio["by_discipline"]["programming"]
                }
                for repo in programming_repos:
                    clean_rk = re.sub(r'[^a-z0-9]', '', repo["title"].lower())
                    if clean_rk and clean_rk not in existing_prog_keys:
                        existing_prog_keys.add(clean_rk)
                        standalone_prog = {
                            "name": f"{repo['title']}.txt",
                            "title": repo["title"],
                            "year": "Desconocido",
                            "software": "GitHub / Código",
                            "technique": "Desarrollo de Software",
                            "description": "Proyecto y repositorio de código abierto en GitHub.",
                            "key": clean_rk,
                            "path": "",
                            "alt_path": "",
                            "category": "coding",
                            "discipline": "programming",
                            "ext": "txt",
                            "folder": folder_name,
                            "repo_url": repo["url"]
                        }
                        portfolio["by_discipline"]["programming"].append(standalone_prog)
                        folder_items.append(standalone_prog)
                        portfolio["all"].append(standalone_prog)

            folder_items.sort(key=lambda x: x["name"])
            portfolio["by_folder"][folder_name] = folder_items

    # Ordenar alfabéticamente
    for disc in portfolio["by_discipline"]:
        portfolio["by_discipline"][disc].sort(key=lambda x: x["title"])

    for cat in ["images", "models", "audio", "video", "other", "all"]:
        portfolio[cat].sort(key=lambda x: x["name"])

    # Guardar en script_dir y en parent_dir
    out_paths = {os.path.join(script_dir, "portfolio_data.json")}
    parent_dir = os.path.dirname(script_dir)
    if os.path.exists(parent_dir):
        out_paths.add(os.path.join(parent_dir, "portfolio_data.json"))

    for out in out_paths:
        try:
            with open(out, "w", encoding="utf-8") as f:
                json.dump(portfolio, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Nota guardando {out}: {e}")

    print("portfolio_data.json generado con éxito extrayendo metadatos dinámicos.")

if __name__ == "__main__":
    scan_portfolio()