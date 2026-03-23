import OpenAI from "openai";
import { PdfReader } from "pdfreader";
import { createClient } from "@supabase/supabase-js";

type ParsedAnalysis = {
  tipo: string;
  significado: string;
  urgencia: string;
  pasos: string[];
  calma: string;
  modo?: string;
};

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
    const openaiKey = process.env.OPENAI_API_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!openaiKey) {
      return Response.json(
        { error: "Falta OPENAI_API_KEY." },
        { status: 500 }
      );
    }

    if (!supabaseUrl || !serviceRoleKey) {
      return Response.json(
        { error: "Faltan variables de Supabase en el servidor." },
        { status: 500 }
      );
    }

    const client = new OpenAI({
      apiKey: openaiKey,
    });

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const formData = await req.formData();
    const file = formData.get("file");
    const userId = formData.get("userId");

    if (!(file instanceof File)) {
      return Response.json(
        { error: "No se recibió archivo." },
        { status: 400 }
      );
    }

    if (!userId || typeof userId !== "string") {
      return Response.json(
        { error: "No se recibió un userId válido." },
        { status: 400 }
      );
    }

    const { data: profileData } = await supabaseAdmin
      .from("profiles")
      .select("plan")
      .eq("id", userId)
      .maybeSingle();

    const isPro = profileData?.plan === "pro";

    if (!isPro) {
      const { count, error: countError } = await supabaseAdmin
        .from("analyses")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      if (countError) {
        console.error("Error contando análisis de PDF:", countError);
        return Response.json(
          { error: "No se pudo verificar el límite del plan." },
          { status: 500 }
        );
      }

      if ((count ?? 0) >= 3) {
        return Response.json(
          {
            error:
              "Has llegado al límite del plan gratuito. Puedes actualizar a SimpleUS Pro.",
            limitReached: true,
          },
          { status: 403 }
        );
      }
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
Eres SimpleUS by RubenHC3_, una aplicación que ayuda a hispanohablantes en Estados Unidos a entender cartas administrativas en inglés.

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

    let parsed: ParsedAnalysis;

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

    const { error: insertError } = await supabaseAdmin.from("analyses").insert([
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
      console.error("Error guardando análisis de PDF en Supabase:", insertError);
      return Response.json(
        { error: "El análisis se generó, pero no se pudo guardar." },
        { status: 500 }
      );
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
