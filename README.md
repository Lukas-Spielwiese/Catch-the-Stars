# Sammle die Sterne – Fix für Vercel

**Was wurde geändert?**
- `index.html` nutzt **relative Pfade** (`./style.css`, `./main.js`).
- `vercel.json` wurde **entfernt**, weil statische Seiten keine Catch‑all‑Rewrite brauchen.
  (Wenn du eine brauchst, lege eine minimale `{ "version": 2 }` an.)

## Deploy (Git)
```bash
git pull
git add .
git commit -m "fix: relative asset paths; remove wrong vercel.json"
git push
```
Vercel deployed automatisch neu.
