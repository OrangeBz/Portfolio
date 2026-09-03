import os
import json
import urllib.request

API_KEY = os.environ.get("LASTFM_API_KEY", "4a913024a027026ae7471b696eb92997")
USER = os.environ.get("LASTFM_USER", "OrangeBz")

def fetch_lastfm(method, limit=5):
    url = f"http://ws.audioscrobbler.com/2.0/?method={method}&user={USER}&api_key={API_KEY}&format=json&limit={limit}"
    req = urllib.request.Request(url, headers={'User-Agent': 'OrangeBzSite/1.0'})
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode('utf-8'))

def get_image_url(image_list, size_index=1):
    if isinstance(image_list, list) and len(image_list) > size_index:
        return image_list[size_index].get("#text", "")
    elif isinstance(image_list, list) and len(image_list) > 0:
        return image_list[0].get("#text", "")
    return ""

try:
    # 1. Top Artistas
    artistas_raw = fetch_lastfm("user.gettopartists", 5).get("topartists", {}).get("artist", [])
    top_artistas = [{"posicion": i+1, "nombre": a.get("name", ""), "reproducciones": a.get("playcount", 0)} for i, a in enumerate(artistas_raw)]

    # 2. Top Álbumes
    albumes_raw = fetch_lastfm("user.gettopalbums", 5).get("topalbums", {}).get("album", [])
    top_albumes = [{
        "posicion": i+1,
        "nombre": a.get("name", ""),
        "artista": a.get("artist", {}).get("name", "") if isinstance(a.get("artist"), dict) else str(a.get("artist", "")),
        "portada": get_image_url(a.get("image", []), 1)
    } for i, a in enumerate(albumes_raw)]

    # 3. Top Canciones
    canciones_raw = fetch_lastfm("user.gettoptracks", 5).get("toptracks", {}).get("track", [])
    top_canciones = [{
        "posicion": i+1,
        "nombre": t.get("name", ""),
        "artista": t.get("artist", {}).get("name", "") if isinstance(t.get("artist"), dict) else str(t.get("artist", ""))
    } for i, t in enumerate(canciones_raw)]

    # 4. Recientes
    recientes_raw = fetch_lastfm("user.getrecenttracks", 8).get("recenttracks", {}).get("track", [])
    recientes = [{
        "cancion": t.get("name", ""),
        "artista": t.get("artist", {}).get("#text", "") if isinstance(t.get("artist"), dict) else str(t.get("artist", "")),
        "album": t.get("album", {}).get("#text", "") if isinstance(t.get("album"), dict) else str(t.get("album", "")),
        "portada": get_image_url(t.get("image", []), 1),
        "fecha": t.get("date", {}).get("#text", "Ahora mismo") if isinstance(t.get("date"), dict) else "Ahora mismo"
    } for i, t in enumerate(recientes_raw)]

    data = {
        "top_artistas_mes": top_artistas,
        "top_albumes_mes": top_albumes,
        "top_canciones_mes": top_canciones,
        "recientes": recientes
    }

    # Guardar en script_dir y opcionalmente en parent dir si es diferente
    script_dir = os.path.dirname(os.path.abspath(__file__))
    out_paths = {os.path.join(script_dir, "scrobbles.json")}
    parent_dir = os.path.dirname(script_dir)
    if os.path.exists(parent_dir):
        out_paths.add(os.path.join(parent_dir, "scrobbles.json"))

    for out in out_paths:
        try:
            with open(out, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Nota guardando {out}: {e}")

    print("scrobbles.json actualizado con éxito.")

except Exception as e:
    print(f"Error actualizando scrobbles: {e}")