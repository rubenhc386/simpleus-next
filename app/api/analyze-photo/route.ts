import OpenAI from "openai";
import { supabase } from "@/lib/supabase";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const imageBase64 = body?.imageBase64;

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return Response.json(
        { error: "No se recibió una imagen válida." },
        { status: 400 }
      );
    }

    const response = await client.responses.create({
      model: "gpt-5.2",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `
Eres SimpleUS by RubenHC, una aplicación que ayuda a hispanohablantes en Estados Unidos a entender cartas administrativas en inglés.

Analiza el contenido de esta imagen, que contiene una carta o documento, y devuelve solamente JSON válido con esta estructura exacta:

{
  "tipo": "Qué es esta carta",
  "significado": "Qué significa en palabras simples",
  "urgencia": "Baja, Media o Alta",
  "pasos": ["Paso 1", "Paso 2", "Paso 3"],
  "calma": "Mensaje de calma y orientación",
  "modo": "real"
}

Reglas:
- Responde siempre en español claro.
- No des asesoría legal.
- No inventes hechos que no estén sustentados por la imagen.
- Si la imagen no se entiende bien, dilo con honestidad.
- El campo "pasos" debe ser un arreglo de 3 a 5 pasos concretos.
- El tono debe ser claro, humano y calmado.
- Devuelve solamente JSON válido, sin texto extra.
              `,
            },
            {
              type: "input_image",
              image_url: imageBase64,
              detail: "auto",
            },
          ],
        },
      ],
    });

    const rawText = response.output_text;

    if (!rawText) {
      return Response.json(
        { error: "La IA no devolvió contenido." },
        { status: 500 }
      );
    }

    let parsed: {
      tipo: string;
      significado: string;
      urgencia: string;
      pasos: string[];
      calma: string;
      modo?: string;
    };

    try {
      parsed = JSON.parse(rawText);
    } catch {
      return Response.json(
        {
          error: "La respuesta de la IA no vino en JSON válido.",
          rawText,
        },
        { status: 500 }
      );
    }

    const { error: insertError } = await supabase.from("analyses").insert([
      {
        original_text: "[análisis desde foto]",
        tipo: parsed.tipo,
        significado: parsed.significado,
        urgencia: parsed.urgencia,
        pasos: parsed.pasos,
        calma: parsed.calma,
        modo: parsed.modo ?? "real",
      },
    ]);

    if (insertError) {
      console.error("Error guardando análisis de foto en Supabase:", insertError);
    }

    return Response.json(parsed);
  } catch (error: any) {
    console.error("Error en analyze-photo:", error);

    return Response.json(
      {
        error: error?.message || "Ocurrió un error al analizar la foto.",
        details: error?.error || null,
        status: error?.status || null,
        code: error?.code || null,
        type: error?.type || null,
      },
      { status: 500 }
    );
  }
}
