import Stripe from "stripe";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      return new Response("Falta firma o webhook secret.", { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId =
        typeof session.metadata?.userId === "string"
          ? session.metadata.userId
          : null;

      const userEmail =
        typeof session.metadata?.userEmail === "string"
          ? session.metadata.userEmail
          : session.customer_details?.email || null;

      const stripeCustomerId =
        typeof session.customer === "string" ? session.customer : null;

      const stripeSubscriptionId =
        typeof session.subscription === "string" ? session.subscription : null;

      if (userId) {
        const { error: planError } = await supabaseAdmin
          .from("profiles")
          .update({
            plan: "pro",
            stripe_customer_id: stripeCustomerId,
            stripe_subscription_id: stripeSubscriptionId,
          })
          .eq("id", userId);

        if (planError) {
          console.error("Error actualizando profile a pro:", planError);
        }

        const { error: conversionError } = await supabaseAdmin
          .from("affiliate_conversions")
          .update({ status: "paid" })
          .eq("user_id", userId)
          .eq("status", "lead");

        if (conversionError) {
          console.error(
            "Error actualizando affiliate_conversions a paid por user_id:",
            conversionError
          );
        }
      } else if (userEmail) {
        const { error: conversionErrorByEmail } = await supabaseAdmin
          .from("affiliate_conversions")
          .update({ status: "paid" })
          .eq("user_email", userEmail)
          .eq("status", "lead");

        if (conversionErrorByEmail) {
          console.error(
            "Error actualizando affiliate_conversions a paid por email:",
            conversionErrorByEmail
          );
        }
      }
    }

    return new Response("ok", { status: 200 });
  } catch (error: any) {
    console.error("Error en stripe webhook:", error);
    return new Response(`Webhook error: ${error.message}`, { status: 400 });
  }
}