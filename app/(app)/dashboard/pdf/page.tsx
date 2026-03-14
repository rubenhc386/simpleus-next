"use client";

import Link from "next/link";
import { useState } from "react";

export default function PdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function analizarPDF() {
    if (!file) {
      setError("Selecciona primero un PDF.");
      return;
    }

    try {
      setCargando(true);
      setError("");

      await new Promise((resolve) => setTimeout(resolve, 500));

      setError(
        "PDF en beta: algunos PDFs pueden fallar dependiendo de cómo fueron generados. Si no funciona, prueba subir una foto del documento o pegar el texto directamente."
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        paddingTop: "40px",
        paddingBottom: "40px",
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
          gap: "16px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "32px", margin: "0 0 10px 0" }}>
            Analizar carta desde PDF
          </h1>
          <p style={{ color: "#6b7280", lineHeight: 1.6, margin: 0 }}>
            Sube un PDF con texto y SimpleUS intentará generar un Mapa SimpleUS.
          </p>
        </div>

        <div
          style={{
            background: "#fff7ed",
            border: "1px solid #fdba74",
            borderRadius: "14px",
            padding: "16px",
            color: "#9a3412",
            lineHeight: 1.6,
          }}
        >
          <strong>PDF en beta:</strong> algunos PDFs pueden fallar dependiendo de
          cómo fueron generados. Si no funciona, prueba subir una{" "}
          <Link
            href="/dashboard/foto"
            style={{ fontWeight: 700, textDecoration: "underline" }}
          >
            foto del documento
          </Link>{" "}
          o{" "}
          <Link
            href="/dashboard/analizar"
            style={{ fontWeight: 700, textDecoration: "underline" }}
          >
            pegar el texto directamente
          </Link>
          .
        </div>

        <label
          style={{
            display: "inline-block",
            background: "#f3f4f6",
            border: "1px solid #d1d5db",
            padding: "12px 16px",
            borderRadius: "10px",
            cursor: "pointer",
            width: "fit-content",
            fontWeight: 600,
          }}
        >
          Seleccionar PDF
          <input
            type="file"
            accept="application/pdf"
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setFile(e.target.files[0]);
                setError("");
              }
            }}
          />
        </label>

        {file && (
          <div style={{ color: "#4b5563" }}>
            <strong>Archivo seleccionado:</strong> {file.name}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={analizarPDF}
            disabled={cargando}
            style={{
              background: cargando ? "#93c5fd" : "#1d4ed8",
              color: "white",
              padding: "12px 18px",
              borderRadius: "10px",
              border: "none",
              cursor: cargando ? "not-allowed" : "pointer",
              fontWeight: 600,
            }}
          >
            {cargando ? "Revisando PDF..." : "Analizar PDF"}
          </button>

          {error && (
            <span style={{ color: "#b91c1c", fontSize: "14px" }}>{error}</span>
          )}
        </div>

        <div
          style={{
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "14px",
            padding: "18px",
            color: "#4b5563",
            lineHeight: 1.6,
          }}
        >
          Mientras estabilizamos PDF, la forma más confiable de usar SimpleUS es
          con{" "}
          <Link
            href="/dashboard/foto"
            style={{ fontWeight: 700, textDecoration: "underline" }}
          >
            foto
          </Link>{" "}
          o{" "}
          <Link
            href="/dashboard/analizar"
            style={{ fontWeight: 700, textDecoration: "underline" }}
          >
            texto
          </Link>
          .
        </div>
      </section>
    </div>
  );
}
