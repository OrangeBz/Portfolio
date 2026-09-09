# Borrador / Especificación: GitHub Actions `save_note.yml`

> [!NOTE]
> Este archivo sirve únicamente como especificación/borrador. Cuando vincules tu repositorio con GitHub, puedes copiar el contenido YAML mostrado a continuación y guardarlo en `.github/workflows/save_note.yml`.

---

## Especificación del Workflow (`save_note.yml`)

```yaml
name: Guardar Nota de Contacto

on:
  repository_dispatch:
    types: [save_note]

permissions:
  contents: write

jobs:
  save-note:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repositorio
        uses: actions/checkout@v4

      - name: Guardar nota recibida del payload
        env:
          NOTE_NAME: ${{ github.event.client_payload.name }}
          NOTE_EMAIL: ${{ github.event.client_payload.email }}
          NOTE_MESSAGE: ${{ github.event.client_payload.message }}
          NOTE_TIMESTAMP: ${{ github.event.client_payload.timestamp }}
        run: |
          mkdir -p notes
          filename="notes/note_$(date +%Y%m%d_%H%M%S).json"
          python3 -c "
          import json, os
          data = {
              'name': os.environ.get('NOTE_NAME', ''),
              'email': os.environ.get('NOTE_EMAIL', ''),
              'message': os.environ.get('NOTE_MESSAGE', ''),
              'timestamp': os.environ.get('NOTE_TIMESTAMP', '')
          }
          with open('$filename', 'w', encoding='utf-8') as f:
              json.dump(data, f, ensure_ascii=False, indent=2)
          "

      - name: Commit y push de la nota
        run: |
          git config --global user.name 'github-actions[bot]'
          git config --global user.email 'github-actions[bot]@users.noreply.github.com'
          git add notes/
          git commit -m "auto: guardar nueva nota de contacto [skip ci]"
          git push
```

---

## Cómo activar en el Frontend (`script.js`) en el futuro

Cuando vincules el repositorio y desees activar la llamada API real:

```javascript
fetch('https://api.github.com/repos/OrangeBz/OrangeBz.github.io/dispatches', {
  method: 'POST',
  headers: {
    'Accept': 'application/vnd.github+json',
    'Authorization': 'Bearer TU_GITHUB_TOKEN_AQUI'
  },
  body: JSON.stringify({
    event_type: 'save_note',
    client_payload: noteData
  })
});
```
