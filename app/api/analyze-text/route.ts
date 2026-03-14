import OpenAI from "openai";
import { supabase } from "@/lib/supabase";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const texto = body?.texto;
    const userId = body?.userId;

    if (userId) {
  const { count } = await supabase
    .from("analyses")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (count && count >= 3) {
    return Response.json(
      {
        error:
          "Has llegado al límite del plan gratuito. Próximamente podrás actualizar a SimpleUS Pro.",
        limitReached: true,
      },
      { status: 403 }
    );
  }
}    

    if (!texto || typeof texto !== "string") {
      return Response.json(
        { error: "No se recibió texto válido." },
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
- Responde siempre en español claro.
- No des asesoría legal.
- No inventes hechos que no estén sustentados por el texto.
- Si el texto es ambiguo, dilo con honestidad.
- El campo "pasos" debe ser un arreglo de 3 a 5 pasos concretos.
- El tono debe ser claro, humano y calmado.
- Devuelve solamente JSON válido, sin texto extra.

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
        user_id: userId ?? null,
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
      console.error("Error guardando análisis en Supabase:", insertError);
    }

    return Response.json(parsed);
  } catch (error: any) {
    console.error("Error en analyze-text completo:", error);

    return Response.json(
      {
        error: error?.message || "Ocurrió un error al analizar la carta.",
        details: error?.error || null,
        status: error?.status || null,
        code: error?.code || null,
        type: error?.type || null,
      },
      { status: 500 }
    );
  }
}
