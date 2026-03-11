import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

/**
 * Endpoint para subir imágenes a Cloudinary desde el servidor.
 * Protegido: solo acepta peticiones desde el mismo origen.
 */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Valida que la petición viene del mismo origen de la aplicación.
 */
function isValidOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const host = req.headers.get("host");

  if (origin) {
    try {
      const originHost = new URL(origin).host;
      if (originHost !== host) return false;
    } catch {
      return false;
    }
  }

  if (!origin && referer) {
    try {
      const refererHost = new URL(referer).host;
      if (refererHost !== host) return false;
    } catch {
      return false;
    }
  }

  if (!origin && !referer) return false;

  return true;
}

export async function POST(req: NextRequest) {
  // --- Validación de seguridad ---
  if (!isValidOrigin(req)) {
    return NextResponse.json(
      { error: "Acceso no autorizado" },
      { status: 403 },
    );
  }

  try {
    const body = await req.json();
    const { image } = body;

    if (!image || typeof image !== "string") {
      return NextResponse.json(
        { error: "Se requiere una imagen válida" },
        { status: 400 },
      );
    }

    // Validar que sea un Data URI de imagen válido
    if (
      !image.startsWith("data:image/") &&
      !image.startsWith("https://")
    ) {
      return NextResponse.json(
        { error: "Formato de imagen no válido" },
        { status: 400 },
      );
    }

    // Limitar tamaño (máx ~10MB)
    if (image.length > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Imagen demasiado grande (máx 10MB)" },
        { status: 413 },
      );
    }

    // Subir la imagen a Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "gastos-app",
      resource_type: "auto",
    });

    return NextResponse.json({
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    });
  } catch (error: unknown) {
    console.error("Cloudinary Upload Error:", error);
    const message =
      error instanceof Error ? error.message : "Error interno del servidor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
