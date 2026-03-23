import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = body?.userId;

    if (!userId || typeof userId !== "string") {
      return Response.json(
        { error: "Falta userId válido." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.from("profiles").upsert(
      {
        id: userId,
        plan: "pro",
      },
      {
        onConflict: "id",
      }
    );

    if (error) {
      console.error("Error activando plan pro:", error);

      return Response.json(
        { error: "No se pudo activar el plan PRO." },
        { status: 500 }
      );
    }

    return Response.json({ ok: true });
  } catch (error: any) {
    console.error("Error en activate-pro:", error);

    return Response.json(
      {
        error: error?.message || "Ocurrió un error activando PRO.",
      },
      { status: 500 }
    );
  }
}
