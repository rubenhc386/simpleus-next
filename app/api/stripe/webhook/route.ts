import Stripe from "stripe";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!stripeSecretKey) {
      return new Response("Falta STRIPE_SECRET_KEY.", { status: 500 });
    }

    if (!stripeWebhookSecret) {
      return new Response("Falta STRIPE_WEBHOOK_SECRET.", { status: 500 });
    }

    if (!supabaseUrl) {
      return new Response("Falta NEXT_PUBLIC_SUPABASE_URL.", { status: 500 });
    }

    if (!supabaseServiceRoleKey) {
      return new Response("Falta SUPABASE_SERVICE_ROLE_KEY.", { status: 500 });
    }

    const stripe = new Stripe(stripeSecretKey);
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      return new Response("Falta stripe-signature.", { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      stripeWebhookSecret
    );

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

      const affiliateCode =
        typeof session.metadata?.affiliateCode === "string"
          ? session.metadata.affiliateCode
          : "";

      const referralCode =
        typeof session.metadata?.referralCode === "string"
          ? session.metadata.referralCode
          : "";

      const stripeCustomerId =
        typeof session.customer === "string" ? session.customer : null;

      const stripeSubscriptionId =
        typeof session.subscription === "string" ? session.subscription : null;

      const amountTotal =
        typeof session.amount_total === "number"
          ? session.amount_total / 100
          : 0;

      const currency =
        typeof session.currency === "string" ? session.currency : "usd";

      if (userId) {
        const { error: profileError } = await supabaseAdmin
          .from("profiles")
          .update({
            plan: "pro",
            stripe_customer_id: stripeCustomerId,
            stripe_subscription_id: stripeSubscriptionId,
          })
          .eq("id", userId);

        if (profileError) {
          console.error("Error actualizando profile a pro:", profileError);
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

      if (affiliateCode) {
        const { error: saleInsertError } = await supabaseAdmin
          .from("affiliate_sales")
          .insert([
            {
              user_id: userId,
              user_email: userEmail,
              affiliate_code: affiliateCode,
              referral_code: referralCode,
              stripe_customer_id: stripeCustomerId,
              stripe_subscription_id: stripeSubscriptionId,
              amount: amountTotal,
              currency,
              status: "paid",
            },
          ]);

        if (saleInsertError) {
          console.error("Error guardando affiliate_sales:", saleInsertError);
        }
      }

      console.log("Checkout completado:", {
        userId,
        userEmail,
        affiliateCode,
        referralCode,
        stripeCustomerId,
        stripeSubscriptionId,
        amountTotal,
        currency,
      });
    }

    return new Response("ok", { status: 200 });
  } catch (error: any) {
    console.error("Error en stripe webhook:", error);
    return new Response(`Webhook error: ${error.message}`, { status: 400 });
  }
}