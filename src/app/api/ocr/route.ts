import { OpenAI } from "openai";
import { NextRequest, NextResponse } from "next/server";

/**
 * Endpoint de OCR que utiliza OpenAI GPT-4o Mini para extraer datos detallados de recibos.
 * Protegido: solo acepta peticiones desde el mismo origen (no desde terceros).
 */

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Valida que la petición viene del mismo origen de la aplicación.
 */
function isValidOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const host = req.headers.get("host");

  // En producción, verificamos que el origin o referer coincida con nuestro host
  if (origin) {
    try {
      const originHost = new URL(origin).host;
      if (originHost !== host) return false;
    } catch {
      return false;
    }
  }

  // Si no hay origin (server-side), verificamos el referer
  if (!origin && referer) {
    try {
      const refererHost = new URL(referer).host;
      if (refererHost !== host) return false;
    } catch {
      return false;
    }
  }

  // Si no hay ni origin ni referer, rechazamos (llamada externa directa)
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

    // Limitar tamaño del payload (máx ~10MB en base64)
    if (image.length > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Imagen demasiado grande (máx 10MB)" },
        { status: 413 },
      );
    }

    // Llamada a la API de OpenAI Vision para analizar la imagen del recibo
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analiza esta imagen de un recibo de compra y extrae los siguientes datos en formato JSON: merchant (nombre del comercio), amount (monto total como número), date (fecha en formato DD/MM/YYYY), category (elige una de: Alimentación, Transporte, Entretenimiento, Servicios, Salud, Educación, Otros), items (una lista de los artículos comprados, cada uno con: description, quantity y price) y raw_text (una representación textual limpia de todo el contenido del ticket, incluyendo artículos y totales). Si no puedes determinar alguno, devuelve un valor vacío o cero.",
            },
            {
              type: "image_url",
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No response from OpenAI");

    return NextResponse.json(JSON.parse(content));
  } catch (error: unknown) {
    console.error("OpenAI OCR Error:", error);
    const message =
      error instanceof Error ? error.message : "Error interno del servidor";
    const status =
      error instanceof Error && "status" in error
        ? (error as Error & { status: number }).status
        : 500;
    return NextResponse.json({ error: message }, { status: status || 500 });
  }
}
