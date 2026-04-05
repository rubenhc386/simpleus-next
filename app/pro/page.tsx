"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type PlanType = "monthly" | "annual";

export default function ProPage() {
  const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    async function cargarUsuario() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUserId(user?.id ?? null);
      setUserEmail(user?.email ?? "");
    }

    cargarUsuario();
  }, []);

  async function handleCheckout(planType: PlanType) {
    try {
      setLoadingPlan(planType);
      setError("");

      if (!userId) {
        throw new Error("No hay sesión activa");
      }

      const affiliateCode =
        typeof window !== "undefined"
          ? localStorage.getItem("affiliate_code") || ""
          : "";

      const referralCode =
        typeof window !== "undefined"
          ? localStorage.getItem("referral_code") || ""
          : "";

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planType,
          userId,
          userEmail,
          affiliateCode,
          referralCode,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.url) {
        throw new Error(data?.error || "Error iniciando pago");
      }

      window.location.href = data.url;
    } catch (err) {
      console.error(err);

      const message =
        err instanceof Error ? err.message : "Error al iniciar pago";

      setError(message);
      setLoadingPlan(null);
    }
  }

  const isLoading = loadingPlan !== null;

  return (
    <div
      style={{
        maxWidth: "980px",
        margin: "0 auto",
        padding: "40px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "28px",
      }}
    >
      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "28px",
        }}
      >
        <h1 style={{ fontSize: "36px", margin: 0 }}>
          Elige tu plan SimpleUS Pro
        </h1>

        <p style={{ fontSize: "18px", color: "#6b7280", marginTop: "12px" }}>
          Analiza cartas sin límite, guarda mejor tu historial y usa SimpleUS
          con una experiencia más completa.
        </p>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Plan mensual
          </div>

          <div
            style={{
              fontSize: "34px",
              fontWeight: 800,
              color: "#111827",
            }}
          >
            $8.99
          </div>

          <div style={{ fontSize: "14px", color: "#6b7280" }}>
            Pago mensual, flexible y sin compromiso a largo plazo.
          </div>

          <ul
            style={{
              lineHeight: 1.9,
              color: "#4b5563",
              paddingLeft: "20px",
              margin: 0,
            }}
          >
            <li>Análisis ilimitados</li>
            <li>Subir fotos de cartas</li>
            <li>PDF en evolución</li>
            <li>Historial completo</li>
          </ul>

          <button
            onClick={() => handleCheckout("monthly")}
            disabled={isLoading}
            style={{
              background:
                loadingPlan === "monthly" || isLoading ? "#93c5fd" : "#1d4ed8",
              color: "#fff",
              padding: "14px 16px",
              borderRadius: "12px",
              border: "none",
              fontWeight: 700,
              fontSize: "16px",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {loadingPlan === "monthly"
              ? "Procesando..."
              : "Elegir plan mensual"}
          </button>
        </div>

        <div
          style={{
            background: "#ecfdf5",
            border: "2px solid #16a34a",
            borderRadius: "16px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-12px",
              right: "18px",
              background: "#16a34a",
              color: "#ffffff",
              padding: "6px 10px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            Más popular
          </div>

          <div
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#166534",
            }}
          >
            Plan anual
          </div>

          <div
            style={{
              fontSize: "34px",
              fontWeight: 800,
              color: "#111827",
            }}
          >
            $89.90
          </div>

          <div style={{ fontSize: "14px", color: "#166534", fontWeight: 700 }}>
            Ahorra $17.98 frente al pago mensual
          </div>

          <ul
            style={{
              lineHeight: 1.9,
              color: "#166534",
              paddingLeft: "20px",
              margin: 0,
            }}
          >
            <li>Análisis ilimitados</li>
            <li>Subir fotos de cartas</li>
            <li>PDF en evolución</li>
            <li>Historial completo</li>
            <li>Mejor valor por 12 meses</li>
          </ul>

          <button
            onClick={() => handleCheckout("annual")}
            disabled={isLoading}
            style={{
              background:
                loadingPlan === "annual" || isLoading ? "#86efac" : "#16a34a",
              color: "#fff",
              padding: "14px 16px",
              borderRadius: "12px",
              border: "none",
              fontWeight: 700,
              fontSize: "16px",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {loadingPlan === "annual"
              ? "Procesando..."
              : "Elegir plan anual"}
          </button>
        </div>
      </section>

      {error && (
        <section
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "12px",
            padding: "16px",
            color: "#991b1b",
            lineHeight: 1.6,
          }}
        >
          {error}
        </section>
      )}

      <div
        style={{
          fontSize: "13px",
          color: "#9ca3af",
          textAlign: "center",
        }}
      >
        ✔ Cancela cuando quieras · ✔ Acceso inmediato · ✔ Pago seguro con Stripe
      </div>
    </div>
  );
}