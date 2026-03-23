"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProPage() {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    try {
      setLoading(true);

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session?.access_token) {
        throw new Error("No hay sesión activa");
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok || !data?.url) {
        throw new Error(data?.error || "Error iniciando pago");
      }

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert("Error al iniciar pago");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: "900px",
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
        <span>✔ A dónde ir exactamente (DMV, IRS, etc)</span>
      </section>

      {/* PRECIO */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        <div
          style={{
            fontSize: "32px",
            fontWeight: 700,
            color: "#111827",
          }}
        >
          $8.99 USD / mes
        </div>

        <div style={{ fontSize: "14px", color: "#6b7280" }}>
          Menos de $0.30 al día para evitar errores importantes
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <button
          onClick={handleCheckout}
          disabled={loading}
          style={{
            background: loading ? "#93c5fd" : "#1d4ed8",
            color: "#fff",
            padding: "16px",
            borderRadius: "12px",
            border: "none",
            fontWeight: 700,
            fontSize: "18px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Procesando..." : "Activar PRO ahora"}
        </button>

        {/* SOCIAL PROOF */}
        <div style={{ fontSize: "13px", color: "#9ca3af" }}>
          Usado por hispanos en Estados Unidos para entender cartas del
          gobierno, bancos y seguros
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
