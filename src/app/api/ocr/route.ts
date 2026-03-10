import { OpenAI } from "openai";
import { NextResponse } from "next/server";

/**
 * Endpoint de OCR que utiliza OpenAI GPT-4o Mini para extraer datos detallados de recibos.
 * Soporta el procesamiento de imágenes mediante URLs (Cloudinary) o Base64.
 */

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Llamada a la API de OpenAI Vision para analizar la imagen del recibo
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Usamos el modelo mini para eficiencia y menor costo
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
                url: image, // La URL puede ser de Cloudinary o un string Base64 Data URI
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" }, // Forzamos a que la IA responda en formato JSON válido
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No response from OpenAI");

    // Devolvemos el objeto JSON extraído directamente al cliente
    return NextResponse.json(JSON.parse(content));
  } catch (error: any) {
    console.error("OpenAI OCR Error:", error);
    // Manejo de errores 401, 429, etc.
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 },
    );
  }
}
