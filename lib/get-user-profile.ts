import { supabase } from "@/lib/supabase";

export type UserProfile = {
  id: string;
  plan: "free" | "pro";
  plan_type: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
};

export async function getUserProfile(): Promise<UserProfile | null> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, plan, plan_type, stripe_customer_id, stripe_subscription_id")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    plan: data.plan === "pro" ? "pro" : "free",
    plan_type: data.plan_type ?? null,
    stripe_customer_id: data.stripe_customer_id ?? null,
    stripe_subscription_id: data.stripe_subscription_id ?? null,
  };
}