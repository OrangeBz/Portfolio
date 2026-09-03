import os
import json

# Configura las carpetas que quieres escanear
TARGET_FOLDERS = ["media", "models", "audio", "projects"]
OUTPUT_FILE = "portfolio_data.json"

# Categorías por extensión de archivo
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
    portfolio = {}

    for folder in TARGET_FOLDERS:
        if not os.path.exists(folder):
            continue

        items = []
        for root, _, files in os.walk(folder):
            for file in files:
                ext = os.path.splitext(file)[1]
                category = get_file_type(ext)
                
                # Guarda la ruta relativa limpia (ej: "media/subcarpeta/dibujo.png")
                rel_path = os.path.relpath(os.path.join(root, file), start=".").replace("\\", "/")
                
                items.append({
                    "name": file,
                    "path": rel_path,
                    "type": category,
                    "ext": ext.replace(".", "")
                })

        # Ordenar alfabéticamente por nombre
        items.sort(key=lambda x: x["name"])
        portfolio[folder] = items

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(portfolio, f, ensure_ascii=False, indent=2)

    print(f"Se generó '{OUTPUT_FILE}' con éxito.")

if __name__ == "__main__":
    scan_portfolio()