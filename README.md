# Sammle die Sterne – Vercel Starter

## Struktur
- `index.html` – HTML-Gerüst
- `style.css` – Styles
- `main.js` – Spiel-Logik (autostart)
- `vercel.json` – Static-Hosting Konfiguration

## Deploy-Optionen

### A) GitHub → Vercel (empfohlen)
1. Neues Repo erstellen (z. B. `space-stars`).
2. Dateien pushen (siehe unten „Git-Befehle“).
3. Auf vercel.com → **Add New Project** → Repo importieren.
4. Framework: **Other**; Build-Command: leer; Output: **/** (Root).
5. Deploy klicken → Live-URL erscheint.

### B) Vercel CLI
```
npm i -g vercel
vercel    # im Projektordner ausführen
```
Fragen beantworten → URL erhalten. Für Updates erneut `vercel`.

## Git-Befehle (erstes Pushen)
```bash
git init
git add .
git commit -m "Initial commit: Sammle die Sterne"
git branch -M main
git remote add origin https://github.com/<dein-user>/<dein-repo>.git
git push -u origin main
```
