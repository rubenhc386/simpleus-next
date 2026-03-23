import Stripe from "stripe";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const sig = headersList.get("stripe-signature");

    console.log("WEBHOOK HIT");

    if (!sig) {
      console.log("No signature header");
      return new Response("No signature", { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );
    } catch (err: any) {
      console.error("Webhook signature error:", err.message);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    console.log("Webhook event type:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log("Checkout session id:", session.id);
      console.log("Checkout metadata:", session.metadata);

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
        { onConflict: "id" }
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
    return new Response("Internal error", { status: 500 });
  }
}
