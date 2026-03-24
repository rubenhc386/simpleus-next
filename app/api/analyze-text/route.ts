import OpenAI from "openai";
import { supabaseAdmin } from "@/lib/supabase-admin";

type ParsedAnalysis = {
  tipo: string;
  significado: string;
  urgencia: string;
  pasos: string[];
  calma: string;
  modo?: string;
};

function calcularDiasRestantes(trialStartedAt: string | null) {
  if (!trialStartedAt) return 0;

  const inicio = new Date(trialStartedAt).getTime();
  const ahora = Date.now();
  const diffMs = ahora - inicio;
  const diffDias = diffMs / (1000 * 60 * 60 * 24);
  const restantes = Math.ceil(3 - diffDias);

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
    const texto = body?.texto;
    const userId = body?.userId;

    if (!texto || typeof texto !== "string" || !texto.trim()) {
      return Response.json(
        { error: "No se recibió texto válido." },
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
      console.error("Error cargando profile para texto:", profileError);
      return Response.json(
        { error: "No se pudo validar el plan del usuario." },
        { status: 500 }
      );
    }

    const isPro = profileData?.plan === "pro";
    const bonusAnalyses = profileData?.bonus_analyses ?? 0;
    const trialStartedAt = profileData?.trial_started_at ?? null;
    const trialDaysRemaining = calcularDiasRestantes(trialStartedAt);
    const isTrialActive = isPro || trialDaysRemaining > 0;

    const freeLimit = 3;
    const realFreeLimit = isPro
      ? Number.MAX_SAFE_INTEGER
      : isTrialActive
      ? freeLimit + bonusAnalyses
      : bonusAnalyses;

    const { count, error: countError } = await supabaseAdmin
      .from("analyses")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (countError) {
      console.error("Error contando análisis de texto:", countError);
      return Response.json(
        { error: "No se pudo verificar el límite del plan." },
        { status: 500 }
      );
    }

    const currentCount = count ?? 0;

    if (!isPro && currentCount >= realFreeLimit) {
      return Response.json(
        {
          error: isTrialActive
            ? "Has llegado al límite disponible de tu plan actual."
            : "Tu prueba gratuita terminó. Solo puedes seguir con análisis ganados por referidos o activando PRO.",
          limitReached: true,
        },
        { status: 403 }
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
      console.error(
        "Error guardando análisis de texto en Supabase:",
        insertError
      );
      return Response.json(
        { error: "El análisis se generó, pero no se pudo guardar." },
        { status: 500 }
      );
    }

    return Response.json(parsed);
  } catch (error: any) {
    console.error("Error en analyze-text:", error);

    return Response.json(
      {
        error: error?.message || "Ocurrió un error al analizar el texto.",
        details: error?.error || null,
        status: error?.status || null,
        code: error?.code || null,
        type: error?.type || null,
      },
      { status: 500 }
    );
  }
}