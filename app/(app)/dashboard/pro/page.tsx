"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type PlanType = "monthly" | "annual";

export default function ProPage() {
  const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");

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
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "40px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "28px",
      }}
    >
      {/* HEADLINE */}
      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "28px",
        }}
      >
        <h1 style={{ fontSize: "36px", margin: 0 }}>
          Entiende cualquier carta en minutos
        </h1>

        <p style={{ fontSize: "18px", color: "#6b7280", marginTop: "12px" }}>
          Evita multas, citas perdidas o problemas legales por no entender
          documentos en inglés.
        </p>
      </section>

      {/* BENEFICIOS */}
      <section
        style={{
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "24px",
          lineHeight: 1.7,
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          fontSize: "15px",
        }}
      >
        <span>✔ Traducción clara al español</span>
        <span>✔ Explicación simple (sin lenguaje complicado)</span>
        <span>✔ Qué hacer paso a paso</span>
        <span>✔ A dónde ir exactamente (DMV, IRS, etc.)</span>
        <span>✔ Análisis ilimitados</span>
      </section>

      {/* PLANES */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {/* MENSUAL */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
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
              fontSize: "32px",
              fontWeight: 800,
              color: "#111827",
            }}
          >
            $8.99 USD / mes
          </div>

          <div style={{ fontSize: "14px", color: "#6b7280" }}>
            Menos de $0.30 al día para evitar errores importantes
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
            <li>Acceso inmediato</li>
            <li>Cancela cuando quieras</li>
          </ul>

          <button
            onClick={() => handleCheckout("monthly")}
            disabled={isLoading}
            style={{
              background:
                loadingPlan === "monthly" || isLoading ? "#93c5fd" : "#1d4ed8",
              color: "#fff",
              padding: "16px",
              borderRadius: "12px",
              border: "none",
              fontWeight: 700,
              fontSize: "18px",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {loadingPlan === "monthly"
              ? "Procesando..."
              : "Activar plan mensual"}
          </button>
        </div>

        {/* ANUAL */}
        <div
          style={{
            background: "#eff6ff",
            border: "2px solid #16a34a",
            borderRadius: "16px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
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
              fontSize: "32px",
              fontWeight: 800,
              color: "#111827",
            }}
          >
            $89.90 USD / año
          </div>

          <div
            style={{
              fontSize: "14px",
              color: "#166534",
              fontWeight: 700,
            }}
          >
            Ahorras $17.98 al año
          </div>

          <ul
            style={{
              lineHeight: 1.9,
              color: "#1e3a8a",
              paddingLeft: "20px",
              margin: 0,
            }}
          >
            <li>Análisis ilimitados</li>
            <li>Mejor precio por 12 meses</li>
            <li>Acceso inmediato</li>
            <li>Más valor a largo plazo</li>
          </ul>

          <button
            onClick={() => handleCheckout("annual")}
            disabled={isLoading}
            style={{
              background:
                loadingPlan === "annual" || isLoading ? "#86efac" : "#16a34a",
              color: "#fff",
              padding: "16px",
              borderRadius: "12px",
              border: "none",
              fontWeight: 700,
              fontSize: "18px",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {loadingPlan === "annual"
              ? "Procesando..."
              : "Activar plan anual"}
          </button>
        </div>
      </section>

      {/* ERROR */}
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

      {/* SOCIAL PROOF */}
      <section>
        <div style={{ fontSize: "13px", color: "#9ca3af" }}>
          Usado por hispanos en Estados Unidos para entender cartas del
          gobierno, bancos y seguros.
        </div>
      </section>

      {/* CONFIANZA */}
      <section
        style={{
          fontSize: "14px",
          color: "#6b7280",
          lineHeight: 1.6,
        }}
      >
        ✔ Cancela cuando quieras
        <br />
        ✔ Acceso inmediato
        <br />
        ✔ Sin contratos
      </section>
    </div>
  );
}