import { headers } from "next/headers";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!stripeSecretKey) {
      throw new Error("Falta STRIPE_SECRET_KEY.");
    }

    if (!webhookSecret) {
      throw new Error("Falta STRIPE_WEBHOOK_SECRET.");
    }

    if (!supabaseUrl) {
      throw new Error("Falta NEXT_PUBLIC_SUPABASE_URL.");
    }

    if (!serviceRoleKey) {
      throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY.");
    }

    const stripe = new Stripe(stripeSecretKey);
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const body = await req.text();
    const headersList = await headers();
    const sig = headersList.get("stripe-signature");

    if (!sig) {
      return new Response("No signature", { status: 400 });
    }

    let event: any;

    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature error:", err.message);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      if (!userId) {
        console.error("No userId in session metadata");
        return new Response("No userId", { status: 400 });
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
        console.error("Error activando PRO:", error);
        return new Response("DB error", { status: 500 });
      }

      console.log("Usuario activado PRO:", userId);
    }

    return new Response("ok", { status: 200 });
  } catch (error: any) {
    console.error("Webhook fatal error:", error);
    return new Response(error?.message || "Internal webhook error", {
      status: 500,
    });
  }
}
