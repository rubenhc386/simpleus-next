import OpenAI from "openai";
import { PdfReader } from "pdfreader";
import { supabase } from "@/lib/supabase";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function extraerTextoDesdePDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    let texto = "";

    new PdfReader().parseBuffer(buffer, (err, item) => {
      if (err) {
        reject(err);
        return;
      }

      if (!item) {
        resolve(texto.trim());
        return;
      }

      if ("text" in item && item.text) {
        texto += item.text + " ";
      }
    });
  });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json(
        { error: "No se recibió archivo." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const texto = await extraerTextoDesdePDF(buffer);

    if (!texto || !texto.trim()) {
      return Response.json(
        { error: "No se pudo extraer texto del PDF." },
        { status: 400 }
      );
    }

    const prompt = `
Eres SimpleUS by RubenHC, una aplicación que ayuda a hispanohablantes en Estados Unidos a entender cartas administrativas en inglés.

Tu tarea es analizar el texto de una carta y devolver solamente JSON válido con esta estructura exacta:

{
  "tipo": "Qué es esta carta",
  "significado": "Qué significa en palabras simples",
  "urgencia": "Baja, Media o Alta",
  "pasos": ["Paso 1", "Paso 2", "Paso 3"],
  "calma": "Mensaje de calma y orientación",
  "modo": "real"
}

Reglas:
•⁠  ⁠Responde siempre en español claro.
•⁠  ⁠No des asesoría legal.
•⁠  ⁠No inventes hechos que no estén sustentados por el texto.
•⁠  ⁠Si el texto es ambiguo, dilo con honestidad.
•⁠  ⁠El campo "pasos" debe ser un arreglo de 3 a 5 pasos concretos.
•⁠  ⁠El tono debe ser claro, humano y calmado.
•⁠  ⁠Devuelve solamente JSON válido, sin texto extra.

Texto de la carta:
"""
${texto}
"""
`;

    const response = await client.responses.create({
      model: "gpt-5.2",
      input: prompt,
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
        original_text: texto,
        tipo: parsed.tipo,
        significado: parsed.significado,
        urgencia: parsed.urgencia,
        pasos: parsed.pasos,
        calma: parsed.calma,
        modo: parsed.modo ?? "real",
      },
    ]);

    if (insertError) {
      console.error("Error guardando análisis de PDF en Supabase:", insertError);
    }

    return Response.json(parsed);
  } catch (error: any) {
    console.error("Error en analyze-pdf:", error);

    return Response.json(
      {
        error: error?.message || "Ocurrió un error al analizar el PDF.",
        details: error?.error || null,
        status: error?.status || null,
        code: error?.code || null,
        type: error?.type || null,
      },
      { status: 500 }
    );
  }
}
