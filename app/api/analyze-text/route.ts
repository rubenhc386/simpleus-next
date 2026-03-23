import OpenAI from "openai";
import { supabase } from "@/lib/supabase";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ParsedAnalysis = {
  tipo: string;
  significado: string;
  urgencia: string;
  pasos: string[];
  calma: string;
  modo?: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const texto = body?.texto;
    const userId = body?.userId;

    if (!texto || typeof texto !== "string") {
      return Response.json(
        { error: "No se recibio texto valido." },
        { status: 400 }
      );
    }

    if (!userId || typeof userId !== "string") {
      return Response.json(
        { error: "No se recibio un userId valido." },
        { status: 400 }
      );
    }

    const { count, error: countError } = await supabase
      .from("analyses")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (countError) {
      console.error("Error contando analisis:", countError);
      return Response.json(
        { error: "No se pudo verificar el limite del plan." },
        { status: 500 }
      );
    }

    if ((count ?? 0) >= 3) {
      return Response.json(
        {
          error:
            "Has llegado al limite del plan gratuito. Proximamente podras actualizar a SimpleUS Pro.",
          limitReached: true,
        },
        { status: 403 }
      );
    }

    const prompt = `
Eres SimpleUS by RubenHC, una aplicacion que ayuda a hispanohablantes en Estados Unidos a entender cartas administrativas en ingles.

Tu tarea es analizar el texto de una carta y devolver solamente JSON valido con esta estructura exacta:

{
  "tipo": "Que es esta carta",
  "significado": "Que significa en palabras simples",
  "urgencia": "Baja, Media o Alta",
  "pasos": ["Paso 1", "Paso 2", "Paso 3"],
  "calma": "Mensaje de calma y orientacion",
  "modo": "real"
}

Reglas:
•⁠  ⁠Responde siempre en espanol claro.
•⁠  ⁠No des asesoria legal.
•⁠  ⁠No inventes hechos que no esten sustentados por el texto.
•⁠  ⁠Si el texto es ambiguo, dilo con honestidad.
•⁠  ⁠El campo "pasos" debe ser un arreglo de 3 a 5 pasos concretos.
•⁠  ⁠El tono debe ser claro, humano y calmado.
•⁠  ⁠Devuelve solamente JSON valido, sin texto extra.

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
        { error: "La IA no devolvio contenido." },
        { status: 500 }
      );
    }

    let parsed: ParsedAnalysis;

    try {
      parsed = JSON.parse(rawText);
    } catch {
      return Response.json(
        {
          error: "La respuesta de la IA no vino en JSON valido.",
          rawText,
        },
        { status: 500 }
      );
    }

    const { error: insertError } = await supabase.from("analyses").insert([
      {
        user_id: userId,
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
      console.error("Error guardando analisis en Supabase:", insertError);
      return Response.json(
        { error: "El analisis se genero, pero no se pudo guardar." },
        { status: 500 }
      );
    }

    return Response.json(parsed);
  } catch (error: any) {
    console.error("Error en analyze-text:", error);

    return Response.json(
      {
        error: error?.message || "Ocurrio un error al analizar la carta.",
        details: error?.error || null,
        status: error?.status || null,
        code: error?.code || null,
        type: error?.type || null,
      },
      { status: 500 }
    );
  }
}
