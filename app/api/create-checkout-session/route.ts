import Stripe from "stripe";

export const runtime = "nodejs";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const appUrl = process.env.NEXT_PUBLIC_URL;

if (!stripeSecretKey) {
  throw new Error("Falta STRIPE_SECRET_KEY");
}

const stripe = new Stripe(stripeSecretKey);

type PlanType = "monthly" | "annual";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const planType = body?.planType as PlanType | undefined;
    const userId = body?.userId;
    const userEmail = body?.userEmail;
    const affiliateCode = body?.affiliateCode;
    const referralCode = body?.referralCode;

    if (!userId || typeof userId !== "string") {
      return Response.json(
        { error: "Falta userId válido." },
        { status: 400 }
      );
    }

    if (planType !== "monthly" && planType !== "annual") {
      return Response.json(
        { error: "Plan inválido." },
        { status: 400 }
      );
    }

    if (!appUrl) {
      return Response.json(
        { error: "Falta NEXT_PUBLIC_URL en variables de entorno." },
        { status: 500 }
      );
    }

    const priceId =
      planType === "monthly"
        ? process.env.STRIPE_PRICE_MONTHLY
        : process.env.STRIPE_PRICE_ANNUAL;

    if (!priceId) {
      return Response.json(
        { error: "Falta configurar el priceId del plan." },
        { status: 500 }
      );
    }

    const cleanUserEmail =
      typeof userEmail === "string" && userEmail.trim()
        ? userEmail.trim()
        : "";

    const cleanAffiliateCode =
      typeof affiliateCode === "string" ? affiliateCode : "";

    const cleanReferralCode =
      typeof referralCode === "string" ? referralCode : "";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      client_reference_id: userId,
      payment_method_collection: "always",
      billing_address_collection: "auto",
      allow_promotion_codes: true,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: cleanUserEmail || undefined,
      metadata: {
        userId,
        userEmail: cleanUserEmail,
        affiliateCode: cleanAffiliateCode,
        referralCode: cleanReferralCode,
        planType,
      },
      subscription_data: {
        metadata: {
          userId,
          userEmail: cleanUserEmail,
          affiliateCode: cleanAffiliateCode,
          referralCode: cleanReferralCode,
          planType,
        },
      },
      success_url: `${appUrl}/pro/exito`,
      cancel_url: `${appUrl}/pro/cancelado`,
    });

    if (!session.url) {
      return Response.json(
        { error: "Stripe no devolvió una URL de checkout." },
        { status: 500 }
      );
    }

    return Response.json({ url: session.url });
  } catch (error: any) {
    console.error("Error creando checkout:", error);

    return Response.json(
      {
        error: "No se pudo crear la sesión de checkout.",
        details: error?.message || null,
      },
      { status: 500 }
    );
  }
}