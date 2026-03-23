"use client";

import { useState } from "react";

export default function ProPage() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function irAPagar() {
    try {
      setCargando(true);
      setError("");

      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "No se pudo iniciar el pago.");
      }

      if (!data?.url) {
        throw new Error("Stripe no devolvio una URL de pago.");
      }

      window.location.href = data.url;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ocurrio un error al abrir Stripe.";
      setError(message);
      setCargando(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "28px",
        paddingTop: "40px",
        paddingBottom: "40px",
        maxWidth: "760px",
        margin: "0 auto",
        paddingLeft: "20px",
        paddingRight: "20px",
      }}
    >
      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <div
          style={{
            display: "inline-block",
            fontSize: "13px",
            color: "#1d4ed8",
            fontWeight: 700,
          }}
        >
          SimpleUS Pro
        </div>

        <h1 style={{ fontSize: "34px", margin: 0 }}>
          Actualiza tu cuenta a Pro
        </h1>

        <p style={{ color: "#4b5563", lineHeight: 1.7, margin: 0 }}>
          Desbloquea analisis ilimitados y una experiencia mas completa dentro de
          SimpleUS.
        </p>
      </section>

      <section
        style={{
          background: "#eff6ff",
          border: "2px solid #1d4ed8",
          borderRadius: "16px",
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <strong style={{ fontSize: "24px", color: "#1d4ed8" }}>
          SimpleUS Pro
        </strong>

        <p style={{ fontSize: "32px", fontWeight: 800, margin: 0 }}>
          $8.99 / mes
        </p>

        <ul style={{ lineHeight: 1.9, margin: 0 }}>
          <li>Analisis ilimitados</li>
          <li>Subir fotos de cartas</li>
          <li>Historial completo</li>
          <li>Experiencia mas completa</li>
        </ul>

        <button
          type="button"
          onClick={irAPagar}
          disabled={cargando}
          style={{
            background: cargando ? "#93c5fd" : "#1d4ed8",
            color: "white",
            padding: "14px 18px",
            borderRadius: "10px",
            border: "none",
            fontWeight: 700,
            cursor: cargando ? "not-allowed" : "pointer",
            fontSize: "16px",
          }}
        >
          {cargando ? "Abriendo Stripe..." : "Actualizar a SimpleUS Pro"}
        </button>

        {error && (
          <div style={{ color: "#991b1b", lineHeight: 1.6 }}>{error}</div>
        )}
      </section>
    </div>
  );
}
