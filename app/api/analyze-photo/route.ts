import OpenAI from "openai";
import { supabaseAdmin } from "@/lib/supabase-admin";

type ParsedAnalysis = {
  tipo: string;
  significado: string;
  urgencia: string;
  pasos: string[];
  checklist: string[];
  calma: string;
  modo?: string;
};

function calcularDiasRestantes(trialStartedAt: string | null) {
  if (!trialStartedAt) return 0;

  const inicio = new Date(trialStartedAt).getTime();
  const ahora = Date.now();
  const diffMs = ahora - inicio;
  const diffDias = diffMs / (1000 * 60 * 60 * 24);
  const restantes = Math.ceil(7 - diffDias);

  return Math.max(restantes, 0);
}

export async function POST(req: Request) {
  try {
    const openAiKey = process.env.OPENAI_API_KEY;

    if (!openAiKey) {
      return Response.json(
        { error: "Falta OPENAI_API_KEY en el servidor." },
        { status: 500 }
      );
    }

    const client = new OpenAI({
      apiKey: openAiKey,
    });

    const body = await req.json();
    const imageBase64 = body?.imageBase64;
    const userId = body?.userId;

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return Response.json(
        { error: "No se recibió una imagen válida." },
        { status: 400 }
      );
    }

    if (!userId || typeof userId !== "string") {
      return Response.json(
        { error: "No se recibió un userId válido." },
        { status: 400 }
      );
    }

    const { data: profileData, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("plan, bonus_analyses, trial_started_at")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      console.error("Error cargando profile para foto:", profileError);
      return Response.json(
        { error: "No se pudo validar el plan del usuario." },
        { status: 500 }
      );
    }

    const isPro = profileData?.plan === "pro";
    const bonusAnalyses = profileData?.bonus_analyses ?? 0;
    const trialStartedAt = profileData?.trial_started_at ?? null;
    const trialDaysRemaining = calcularDiasRestantes(trialStartedAt);
    const isTrialActive = trialDaysRemaining > 0;

    const { count, error: countError } = await supabaseAdmin
      .from("analyses")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    if (countError) {
      console.error("Error contando análisis de foto:", countError);
      return Response.json(
        { error: "No se pudo verificar el límite del plan." },
        { status: 500 }
      );
    }

    const currentCount = count ?? 0;

    const canAnalyze = isPro || isTrialActive || bonusAnalyses > currentCount;

    if (!canAnalyze) {
      return Response.json(
        {
          error:
            "Tu prueba gratuita de 7 días ya terminó. Ahora solo puedes seguir con análisis ganados por referidos o activando PRO.",
          limitReached: true,
          trialEnded: true,
        },
        { status: 403 }
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
Eres SimpleUS by RubenHC3_, una aplicación que ayuda a hispanohablantes en Estados Unidos a entender cartas administrativas en inglés.

Analiza el contenido de esta imagen, que contiene una carta o documento, y devuelve solamente JSON válido con esta estructura exacta:

{
  "tipo": "Qué es esta carta",
  "significado": "Qué significa en palabras simples",
  "urgencia": "Baja, Media o Alta",
  "pasos": ["Paso 1", "Paso 2", "Paso 3"],
  "checklist": ["Acción concreta 1", "Acción concreta 2"],
  "calma": "Mensaje de calma y orientación",
  "modo": "real"
}

Reglas:
- Responde siempre en español claro.
- No des asesoría legal.
- No inventes hechos que no estén sustentados por la imagen.
- Si la imagen no se entiende bien, dilo con honestidad.
- El campo "pasos" debe ser un arreglo de 3 a 5 pasos concretos.
- El campo "checklist" debe ser una lista simple de tareas concretas, tipo lista para completar.
- El checklist debe tener entre 3 y 6 elementos.
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

    supabaseAdmin
      .from("analyses")
      .insert([
        {
          user_id: userId,
          original_text: "[análisis desde foto]",
          tipo: parsed.tipo,
          significado: parsed.significado,
          urgencia: parsed.urgencia,
          pasos: parsed.pasos,
          checklist: parsed.checklist ?? [],
          calma: parsed.calma,
          modo: parsed.modo ?? "real",
        },
      ])
      .then(({ error }) => {
        if (error) {
          console.error(
            "Error guardando análisis de foto en Supabase:",
            error
          );
        }
      });

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
