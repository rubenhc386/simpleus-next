import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export async function POST(req: Request) {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!appUrl) {
      throw new Error("Falta NEXT_PUBLIC_APP_URL en variables de entorno.");
    }

    if (!process.env.NEXT_PUBLIC_STRIPE_PRICE_ID) {
      throw new Error("Falta NEXT_PUBLIC_STRIPE_PRICE_ID.");
    }

    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      throw new Error("No se encontró token de autorización.");
    }

    const accessToken = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      throw new Error("Usuario no autenticado.");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/pro/exito`,
      cancel_url: `${appUrl}/pro/cancelado`,
      metadata: {
        userId: user.id,
      },
    });

    if (!session.url) {
      throw new Error("Stripe no devolvió URL.");
    }

    return Response.json({ url: session.url });
  } catch (error: any) {
    console.error("Error creando checkout:", error);

    return Response.json(
      {
        error: error?.message || "No se pudo crear la sesión de pago.",
      },
      { status: 500 }
    );
  }
}
