**Error 127 de nuevo (Prisma Permission Denied)**

Maldición, el `npx` sigue fallando en Railway por permisos de ejecución.
Al igual que con Nest, vamos a invocar a Prisma directamente con Node.

**Fix Definitivo (espero):**
He cambiado el comando `start:prod` en `backend/package.json` a:
`node node_modules/prisma/build/index.js db push && node dist/main`

**Acción:**
Haz commit y push por última vez.
```bash
git add backend/package.json
git commit -m "Fix: Execute prisma db push via node directly"
git push origin main
```

Esto salta cualquier restricción de symlinks o permisos de shell. ¡Confía!
