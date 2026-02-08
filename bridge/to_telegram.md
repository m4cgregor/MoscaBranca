**Solución al Error de Railway (Prisma Permission Denied)**

Grego, el error `sh: 1: prisma: Permission denied` o comando no encontrado ocurre porque Railway instala las dependencias en modo producción (`npm install`), ignorando las `devDependencies` donde estaba `prisma`.

**He realizado la corrección:**
1.  Moví `prisma` de `devDependencies` a `dependencies` en `backend/package.json`.

**Pasos para ti:**
1.  Haz un commit y push de este cambio (`backend/package.json`):
    ```bash
    git add backend/package.json
    git commit -m "Fix: Move prisma to dependencies for Railway build"
    git push origin main
    ```
2.  Esto disparará un nuevo deploy en Railway automáticamente.
3.  El comando de build `npm install && npx prisma generate && npm run build` ahora debería funcionar.

Avísame si el deploy pasa a verde.
