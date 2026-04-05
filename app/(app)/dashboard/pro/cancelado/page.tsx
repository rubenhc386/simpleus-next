"use client";

import Link from "next/link";
import { useEffect } from "react";
import { setGlobalNotification } from "@/lib/notifications";

export default function ProCanceladoPage() {
  useEffect(() => {
    setGlobalNotification({
      type: "warning",
      title: "Pago cancelado",
      message:
        "No se completó tu suscripción. Puedes intentarlo de nuevo cuando quieras.",
      primaryAction: {
        label: "Revisar precios",
        href: "/precios",
      },
    });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        paddingTop: "40px",
        paddingBottom: "40px",
        maxWidth: "760px",
      }}
    >
      <div
        style={{
          background: "#fff7ed",
          border: "1px solid #fdba74",
          borderRadius: "16px",
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "#c2410c",
          }}
        >
          Pago cancelado
        </div>

        <h1 style={{ fontSize: "34px", margin: 0, color: "#9a3412" }}>
          Tu pago no se completó
        </h1>

        <p style={{ color: "#9a3412", lineHeight: 1.7, margin: 0 }}>
          No te preocupes. Tu suscripción Pro no fue activada y puedes volver a
          intentarlo cuando quieras.
        </p>
      </div>

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <h2 style={{ margin: 0 }}>¿Qué quieres hacer ahora?</h2>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/dashboard"
            style={{
              background: "#1d4ed8",
              color: "#ffffff",
              padding: "12px 16px",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Volver al dashboard
          </Link>

          <Link
            href="/precios"
            style={{
              background: "#ffffff",
              color: "#111827",
              padding: "12px 16px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Revisar precios
          </Link>
        </div>
      </div>
    </div>
  );
}