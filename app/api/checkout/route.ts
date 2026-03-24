import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Falta STRIPE_SECRET_KEY en el servidor." },
        { status: 500 }
      );
    }

    if (!supabaseUrl) {
      return NextResponse.json(
        { error: "Falta NEXT_PUBLIC_SUPABASE_URL en el servidor." },
        { status: 500 }
      );
    }

    if (!supabaseServiceRoleKey) {
      return NextResponse.json(
        { error: "Falta SUPABASE_SERVICE_ROLE_KEY en el servidor." },
        { status: 500 }
      );
    }

    if (!priceId) {
      return NextResponse.json(
        { error: "Falta NEXT_PUBLIC_STRIPE_PRICE_ID en el servidor." },
        { status: 500 }
      );
    }

    if (!appUrl) {
      return NextResponse.json(
        { error: "Falta NEXT_PUBLIC_APP_URL en el servidor." },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "No se recibió autorización válida." },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: "No se pudo identificar al usuario." },
        { status: 401 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/dashboard?checkout=success`,
      cancel_url: `${appUrl}/pro?checkout=cancel`,
      customer_email: user.email || undefined,
      metadata: {
        userId: user.id,
        userEmail: user.email || "",
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          userEmail: user.email || "",
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Error en /api/checkout:", error);

    return NextResponse.json(
      { error: error?.message || "No se pudo iniciar checkout." },
      { status: 500 }
    );
  }
}