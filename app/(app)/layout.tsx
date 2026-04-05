"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageContainer from "@/components/layout/page-container";
import SessionGuard from "@/components/session/session-guard";
import GlobalNotificationBanner from "@/components/ui/global-notification-banner";
import { supabase } from "@/lib/supabase";

function generarCodigo() {
  return Math.random().toString(36).substring(2, 8);
}

export default function PrivateAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);
  const ensuringProfileRef = useRef(false);
const redirectingRef = useRef(false);
  useEffect(() => {
    let active = true;

    async function ensureProfile(userId: string) {
      if (ensuringProfileRef.current) return;

      ensuringProfileRef.current = true;

      try {
        const { data: existingProfile, error: profileReadError } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", userId)
          .maybeSingle();

        if (profileReadError) {
          console.error("Error leyendo profile:", profileReadError);
          return;
        }

        if (existingProfile?.id) {
          return;
        }

        const referralCodeFromStorage =
          typeof window !== "undefined"
            ? localStorage.getItem("referral_code")
            : null;

        let referredById: string | null = null;

        if (referralCodeFromStorage) {
          const { data: referralOwner, error: referralLookupError } =
            await supabase
              .from("profiles")
              .select("id")
              .eq("referral_code", referralCodeFromStorage)
              .maybeSingle();

          if (
            !referralLookupError &&
            referralOwner?.id &&
            referralOwner.id !== userId
          ) {
            referredById = referralOwner.id;
          }
        }

        let nuevoCodigo = generarCodigo();

        const { data: existingReferralCode } = await supabase
          .from("profiles")
          .select("id")
          .eq("referral_code", nuevoCodigo)
          .maybeSingle();

        if (existingReferralCode?.id) {
          nuevoCodigo =
            generarCodigo() + Math.floor(Math.random() * 10).toString();
        }

        const { data: authUserData } = await supabase.auth.getUser();
        const authEmail = authUserData?.user?.email || null;

        const { error: insertError } = await supabase.from("profiles").insert({
          id: userId,
          email: authEmail,
          plan: "free",
          referral_code: nuevoCodigo,
          referred_by: referredById,
          referrals_count: 0,
          bonus_analyses: 0,
          trial_started_at: new Date().toISOString(),
        });

        if (insertError) {
          console.error("Error creando profile:", insertError);
          return;
        }

        if (referredById) {
          const { error: incrementError } = await supabase.rpc(
            "increment_referrals",
            {
              user_id_input: referredById,
            }
          );

          if (incrementError) {
            console.error(
              "Error incrementando referrals_count:",
              incrementError
            );
          }

          const { error: inviterBonusError } = await supabase.rpc(
            "add_bonus_analysis",
            {
              user_id_input: referredById,
            }
          );

          if (inviterBonusError) {
            console.error(
              "Error sumando bonus al invitador:",
              inviterBonusError
            );
          }

          const { error: invitedBonusError } = await supabase.rpc(
            "add_bonus_analysis",
            {
              user_id_input: userId,
            }
          );

          if (invitedBonusError) {
            console.error("Error sumando bonus al invitado:", invitedBonusError);
          }

          if (typeof window !== "undefined") {
            localStorage.removeItem("referral_code");
          }
        }
      } catch (error) {
        console.error("Error general asegurando profile:", error);
      } finally {
        ensuringProfileRef.current = false;
      }
    }
function safeRedirect() {
  if (redirectingRef.current) return;

  redirectingRef.current = true;
  router.replace("/");
}
    async function verificarSesion() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!active) return;

        if (!user) {
          safeRedirect();
          return;
        }

        await ensureProfile(user.id);

        if (!active) return;
        setCheckingSession(false);
      } catch (error) {
        console.error("Error verificando sesión:", error);
        if (!active) return;
        safeRedirect();
      }
    }

    verificarSesion();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!active) return;

      if (!session?.user) {
        safeRedirect();
        return;
      }

      await ensureProfile(session.user.id);

      if (!active) return;
      setCheckingSession(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [router]);

  if (checkingSession) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f9fafb",
          padding: "20px",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "28px",
            minWidth: "280px",
            textAlign: "center",
          }}
        >
          Verificando sesión...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f9fafb",
      }}
    >
      <SessionGuard />
      <Navbar />
      <PageContainer>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <GlobalNotificationBanner />
          {children}
        </div>
      </PageContainer>
      <Footer />
    </div>
  );
}