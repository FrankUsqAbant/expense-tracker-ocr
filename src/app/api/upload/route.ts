import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

/**
 * Endpoint para subir imágenes directamente a Cloudinary desde el servidor.
 * Esto asegura que las credenciales no se expongan en el lado del cliente.
 */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Subir la imagen (en formato Base64) a la carpeta 'gastos-app' en Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "gastos-app",
      resource_type: "auto", // Detecta automáticamente si es imagen, etc.
    });

    // Retornamos la URL segura de Cloudinary para que el OCR la procese
    return NextResponse.json({
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    });
  } catch (error: any) {
    console.error("Cloudinary Upload Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
