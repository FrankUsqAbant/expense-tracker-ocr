# Guía de Despliegue en Render 🚀

Esta guía te ayudará a desplegar tu aplicación de Gastos en Render por primera vez.

## Requisitos Previos

1.  **Código en GitHub**: Asegúrate de que tu código actual esté subido a un repositorio de GitHub (o GitLab/Bitbucket).
2.  **Base de Datos en Render**: Ya tienes los enlaces de tu base de datos de PostgreSQL en Render.

---

## Paso 1: Crear un nuevo Web Service

1.  Inicia sesión en tu dashboard de [Render](https://dashboard.render.com/).
2.  Haz clic en el botón **"New +"** y selecciona **"Web Service"**.
3.  Conecta tu repositorio de GitHub donde tienes el proyecto.

## Paso 2: Configuración del Servicio

En la pantalla de configuración, asegúrate de llenar los siguientes campos:

- **Name**: `gastos-app` (o el nombre que prefieras).
- **Region**: `Oregon` (debe coincidir con la región de tu base de datos para mejor rendimiento).
- **Root Directory**: (Déjalo vacío si el proyecto está en la raíz).
- **Language**: `Node`.
- **Build Command**:
  ```bash
  npm install && npm run build
  ```
- **Start Command**:
  ```bash
  npm run start
  ```

> [!NOTE]
> El comando `prisma generate` se ejecuta automáticamente gracias al script `postinstall` que añadimos en `package.json`.

## Paso 3: Configurar Variables de Entorno

Este paso es CRUCIAL. Haz clic en la pestaña **"Environment"** y agrega las siguientes variables de tu archivo `.env.local`:

| Key                     | Value                                                                                              | Nota                                                             |
| :---------------------- | :------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------- |
| `DATABASE_URL`          | `postgresql://...`                                                                                 | **USA EL INTERNAL URL** (el que termina en `-a`) para mayor velocidad. |
| `OPENAI_API_KEY`        | `sk-proj-...`                                                                                      | Tu clave de OpenAI.                                              |
| `CLOUDINARY_CLOUD_NAME` | `...`                                                                                              | Tu cloud name de Cloudinary.                                     |
| `CLOUDINARY_API_KEY`    | `...`                                                                                              | Tu API key de Cloudinary.                                        |
| `CLOUDINARY_API_SECRET` | `...`                                                                                              | Tu API secret de Cloudinary.                                     |
| `NEXTAUTH_SECRET`       | `un-valor-aleatorio-largo`                                                                         | (Si usas Auth) Necesario para la seguridad de la sesión.         |

> [!TIP]
> Puedes usar el botón **"Advanced"** -> **"Add Secret File"** si prefieres subir el archivo `.env` completo, pero es más común y seguro agregarlas una por una en la sección "Environment Variables".

## Paso 4: Inicializar la Base de Datos (Solo la primera vez)

Una vez que el servicio intente desplegarse, la base de datos necesita tener las tablas creadas.

1.  En el dashboard de Render de tu base de datos PostgreSQL, asegúrate de que esté activa.
2.  Si es la primera vez, el comando de construcción `npx prisma generate` prepara el cliente, pero no crea las tablas.
3.  Para crear las tablas en la nube, puedes ejecutar este comando una única vez desde tu terminal local (asegurándote de tener el `DATABASE_URL` externo en tu `.env.local`):
    ```bash
    npx prisma db push
    ```

## Paso 5: ¡Desplegar!

Render comenzará el proceso de "Build". Puedes ver los logs en tiempo real. Si todo sale bien, verás un mensaje de **"Live"** y Render te dará una URL (ej. `gastos-app.onrender.com`).

---

## Solución de Problemas Comunes

- **Error de Memoria**: Si el build falla por memoria, asegúrate de estar usando el plan gratuito (o el que corresponda) y que no haya procesos pesados innecesarios.
- **Error de Conexión a DB**: Verifica que el `DATABASE_URL` sea el **Internal** si el Web Service y la DB están en la misma cuenta de Render.
