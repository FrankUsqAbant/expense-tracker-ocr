# GastosApp - OCR Expense Tracker 🚀

Gestiona tus gastos con facilidad usando inteligencia artificial y escaneo OCR.

**🌍 URL de Producción:** [https://expense-tracker-ocr-jpmz.onrender.com](https://expense-tracker-ocr-jpmz.onrender.com)

---

## ⚠️ Aviso Crítico sobre la Base de Datos (Render Free Tier)

Actualmente, este proyecto está utilizando la **Capa Gratuita de Base de Datos de Render**. 

Render **elimina las bases de datos gratuitas automáticamente a los 90 días** de su creación. 

### ¿Cómo cambiar a una base de datos permanente y gratuita?

Antes de que pasen los 90 días, te recomendamos cambiar la base de datos a un proveedor permanente (como Supabase o Neon.tech) siguiendo estos sencillos pasos:

1. Crea una cuenta gratuita en [Neon.tech](https://neon.tech/) o [Supabase](https://supabase.com/).
2. Crea un nuevo proyecto/base de datos PostgreSQL en su plataforma.
3. Copia la nueva URL de conexión (`postgresql://...`).
4. Ve al dashboard de Render de este proyecto (`expense-tracker-ocr`).
5. Ve a la pestaña **Environment**.
6. Edita la variable `DATABASE_URL` y pega el nuevo enlace.
7. Guarda los cambios y Render reiniciará la app automáticamente conectada a la nueva base de datos.

El código de la aplicación está preparado para funcionar perfectamente sin hacer ningún cambio en el repositorio, solo cambiando esa variable de entorno.

---

## Tecnologías Utilizadas

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS
- **Base de Datos:** PostgreSQL (vía Prisma ORM)
- **IA / OCR:** OpenAI (`gpt-4o-mini`)
- **Almacenamiento de Imágenes:** Cloudinary

