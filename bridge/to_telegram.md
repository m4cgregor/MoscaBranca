**Error 500: Faltan las Tablas en la Base de Datos**

El error 500 ocurre porque la Base de Datos en Railway está **vacía**. No tiene las tablas (`User`, `OtpCode`, etc.), por lo que el backend choca al intentar guardar el OTP.

**Solución Automática:**
He modificado el comando de inicio en `backend/package.json` para que cree las tablas automáticamente al arrancar.

**Pasos:**
1.  Haz commit y push de este cambio:
    ```bash
    git add backend/package.json
    git commit -m "Fix: Auto-run prisma db push on startup"
    git push origin main
    ```
2.  Espera a que Railway redespliegue.
3.  Vuelve a probar el Registro.

¡Esta vez debería funcionar!
