import os
import json

TARGET_FOLDERS = ["media", "models", "audio", "projects", "images"]

FILE_TYPES = {
    "image": {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"},
    "model": {".glb", ".gltf"},
    "audio": {".mp3", ".wav", ".ogg"},
    "video": {".mp4", ".webm"}
}

def get_file_type(extension):
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
    
    portfolio = {}

    for folder in TARGET_FOLDERS:
        folder_path = None
        for base in possible_roots:
            candidate = os.path.join(base, folder)
            if os.path.exists(candidate) and os.path.isdir(candidate):
                folder_path = candidate
                break
        
        if not folder_path:
            continue

        items = []
        for root, _, files in os.walk(folder_path):
            for file in files:
                ext = os.path.splitext(file)[1]
                category = get_file_type(ext)
                
                rel_path = os.path.relpath(os.path.join(root, file), start=os.path.dirname(folder_path)).replace("\\", "/")
                
                items.append({
                    "name": file,
                    "path": rel_path,
                    "type": category,
                    "ext": ext.replace(".", "")
                })

        items.sort(key=lambda x: x["name"])
        portfolio[folder] = items

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