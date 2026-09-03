import os
import json

TARGET_FOLDERS = ["media", "models", "audio", "projects", "images"]

FILE_TYPES = {
    "images": {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".bmp"},
    "models": {".glb", ".gltf", ".obj", ".fbx"},
    "audio": {".mp3", ".wav", ".ogg", ".flac", ".m4a"},
    "video": {".mp4", ".webm", ".mov"}
}

def get_category_by_ext(extension):
    ext = extension.lower()
    for category, exts in FILE_TYPES.items():
        if ext in exts:
            return category
    return "other"

def scan_portfolio():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    possible_roots = [
        script_dir,
        os.path.dirname(script_dir)
    ]

    portfolio = {
        "images": [],
        "models": [],
        "audio": [],
        "video": [],
        "other": [],
        "by_folder": {},
        "all": []
    }

    # Escaneo sobre el directorio principal 'media' y carpetas adicionales
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

            folder_items = []
            for root_dir, _, files in os.walk(folder_dir):
                for file in files:
                    ext = os.path.splitext(file)[1].lower()
                    category = get_category_by_ext(ext)
                    
                    # Ruta relativa normalizada para frontend web
                    rel_path = os.path.relpath(os.path.join(root_dir, file), start=base).replace("\\", "/")
                    
                    item_data = {
                        "name": file,
                        "key": os.path.splitext(file)[0].lower(),
                        "path": rel_path,
                        "category": category,
                        "ext": ext.replace(".", ""),
                        "folder": folder_name
                    }
                    
                    if category in portfolio:
                        portfolio[category].append(item_data)
                    else:
                        portfolio["other"].append(item_data)
                    
                    folder_items.append(item_data)
                    portfolio["all"].append(item_data)

            folder_items.sort(key=lambda x: x["name"])
            portfolio["by_folder"][folder_name] = folder_items

    # Ordenar alfabéticamente
    for cat in ["images", "models", "audio", "video", "other", "all"]:
        portfolio[cat].sort(key=lambda x: x["name"])

    # Guardar en script_dir y en la raíz del repositorio
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

    print("portfolio_data.json generado con éxito.")

if __name__ == "__main__":
    scan_portfolio()