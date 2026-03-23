import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;

    if (!stripeSecretKey) {
      throw new Error("Falta STRIPE_SECRET_KEY.");
    }

    if (!appUrl) {
      throw new Error("Falta NEXT_PUBLIC_APP_URL.");
    }

    if (!supabaseUrl) {
      throw new Error("Falta NEXT_PUBLIC_SUPABASE_URL.");
    }

    if (!supabaseAnonKey) {
      throw new Error("Falta NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    }

    if (!priceId) {
      throw new Error("Falta NEXT_PUBLIC_STRIPE_PRICE_ID.");
    }

    const stripe = new Stripe(stripeSecretKey);

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
          price: priceId,
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
      throw new Error("Stripe no devolvió una URL de pago.");
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
