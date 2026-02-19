---
name: whatsapp_connection
description: Connection details and management URL for the Evolution API WhatsApp service on Railway.
---

# WhatsApp Evolution API Connection

This skill stores the critical information to access and manage the WhatsApp integration.

## 🔗 Manager URL (Panel de Control)
**https://evolution-api-production-eb3a.up.railway.app/manager**

## 🔑 Credenciales
- **Global API Key**: `moscabranca-secret-key` (Valor por defecto, verificar si se cambió).
- **Nombre de Instancia**: `moscabranca-main` (Debe ser exacto para que el backend conecte).

## 🛠️ Detalles de Configuración (Railway)
- **Plataforma**: Railway
- **Imagen Docker**: `evoapicloud/evolution-api:latest` (o `v2.3.7`)
- **Base de Datos**: Postgres (Connection URI termina en `?schema=evolution`)
- **Redis**: Deshabilitado (`CACHE_REDIS_ENABLED=false`)

## 🆘 Troubleshooting Común
1.  **QR no aparece**: Refrescar la página del Manager (F5) o verificar que Redis esté desactivado si no se usa.
2.  **Instancia trabada**: Borrar la instancia `moscabranca-main` y volver a crearla con el mismo nombre.
3.  **Backend no conecta**: Verificar que la variable `EVOLUTION_API_URL` en el backend apunte a la URL de arriba.
