import Stripe from "stripe";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export async function POST(req: Request) {
  const body = await req.text();
const headersList = await headers();
const sig = headersList.get("stripe-signature");

  if (!sig) {
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

  // 🔥 Evento clave
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const email = session.customer_details?.email;

    if (!email) {
      console.error("No email in session");
      return new Response("No email", { status: 400 });
    }

    // 🔍 Buscar usuario en Supabase por email
    const { data: users, error: userError } =
      await supabaseAdmin.auth.admin.listUsers();

    if (userError) {
      console.error("Error obteniendo usuarios:", userError);
      return new Response("Error users", { status: 500 });
    }

    const user = users.users.find((u) => u.email === email);

    if (!user) {
      console.error("Usuario no encontrado:", email);
      return new Response("User not found", { status: 404 });
    }

    // 🔥 Activar PRO
    const { error } = await supabaseAdmin.from("profiles").upsert(
      {
        id: user.id,
        plan: "pro",
      },
      { onConflict: "id" }
    );

    if (error) {
      console.error("Error activando PRO:", error);
      return new Response("DB error", { status: 500 });
    }

    console.log("Usuario activado PRO:", email);
  }

  return new Response("ok", { status: 200 });
}