"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ResultadoMapa = {
  tipo: string;
  significado: string;
  urgencia: string;
  pasos: string[];
  calma: string;
  modo?: string;
};

function getUrgenciaStyles(urgencia: string) {
  const value = urgencia.toLowerCase();

  if (value.includes("alta")) {
    return {
      bg: "#fee2e2",
      color: "#991b1b",
      label: "Alta urgencia",
    };
  }

  if (value.includes("media")) {
    return {
      bg: "#fef3c7",
      color: "#92400e",
      label: "Urgencia media",
    };
  }

  return {
    bg: "#dcfce7",
    color: "#166534",
    label: "Baja urgencia",
  };
}

export default function PdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [resultado, setResultado] = useState<ResultadoMapa | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [limitReached, setLimitReached] = useState(false);
  const [analysisCount, setAnalysisCount] = useState(0);
  const [plan, setPlan] = useState<"free" | "pro">("free");

  const freeLimit = 3;
  const isPro = plan === "pro";
  const isBlocked = !isPro && analysisCount >= freeLimit;

  async function cargarConteoYPlan() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setPlan("free");
      setAnalysisCount(0);
      setLimitReached(false);
      return;
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .maybeSingle();

    const nextPlan =
      !profileError && profileData?.plan === "pro" ? "pro" : "free";

    setPlan(nextPlan);

    const { count, error: countError } = await supabase
      .from("analyses")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (countError) {
      console.error("Error cargando conteo de PDF:", countError);
      return;
    }

    const nextCount = count ?? 0;
    setAnalysisCount(nextCount);

    if (nextPlan === "pro") {
      setLimitReached(false);
    } else {
      setLimitReached(nextCount >= freeLimit);
    }
  }

  useEffect(() => {
    cargarConteoYPlan();
  }, []);

  async function analizarPDF() {
    if (isBlocked) {
      setLimitReached(true);
      setResultado(null);
      setError("");
      return;
    }

    if (!file) {
      setError("Selecciona primero un archivo PDF.");
      return;
    }

    try {
      setCargando(true);
      setError("");
      setResultado(null);
      setLimitReached(false);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("No se encontró una sesión activa.");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", user.id);

      const res = await fetch("/api/analyze-pdf", {
        method: "POST",
        body: formData,
      });

      let data: any = null;

      try {
        data = await res.json();
      } catch {
        throw new Error("El servidor devolvió una respuesta inválida.");
      }

      if (data?.limitReached && !isPro) {
        setLimitReached(true);
        await cargarConteoYPlan();
        return;
      }

      if (!res.ok) {
        throw new Error(data?.error || "No se pudo analizar el PDF.");
      }

      setResultado(data);
      await cargarConteoYPlan();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Ocurrió un error al analizar el PDF.";
      setError(message);
    } finally {
      setCargando(false);
    }
  }

  const urgenciaStyles = resultado
    ? getUrgenciaStyles(resultado.urgencia)
    : null;

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
            Analizar carta en PDF
          </h1>

          <div
            style={{
              background: isPro
                ? "#ecfdf5"
                : isBlocked
                ? "#fff7ed"
                : "#f9fafb",
              border: isPro
                ? "1px solid #86efac"
                : isBlocked
                ? "1px solid #fdba74"
                : "1px solid #e5e7eb",
              borderRadius: "10px",
              padding: "10px 14px",
              fontSize: "14px",
              color: isPro ? "#166534" : isBlocked ? "#9a3412" : "#374151",
              width: "fit-content",
              fontWeight: 600,
              marginBottom: "12px",
            }}
          >
            {isPro ? (
              <>Plan <strong>PRO activo</strong></>
            ) : (
              <>
                Plan gratuito: <strong>{analysisCount} de {freeLimit}</strong>{" "}
                análisis usados
              </>
            )}
          </div>

          <p style={{ color: "#6b7280", lineHeight: 1.6, margin: 0 }}>
            Sube un archivo PDF y SimpleUS intentará extraer el texto para
            generar un Mapa SimpleUS.
          </p>
        </div>

        {isBlocked && !isPro && (
          <div
            style={{
              background: "#fff7ed",
              border: "1px solid #fdba74",
              borderRadius: "12px",
              padding: "14px 16px",
              color: "#9a3412",
              lineHeight: 1.6,
            }}
          >
            Ya alcanzaste el límite del plan gratuito. Para seguir analizando
            cartas en PDF, necesitaremos activar SimpleUS Pro.
          </div>
        )}

        <label
          style={{
            display: "inline-block",
            background: isBlocked ? "#e5e7eb" : "#ffffff",
            border: "1px solid #d1d5db",
            borderRadius: "10px",
            padding: "12px 16px",
            cursor: isBlocked ? "not-allowed" : "pointer",
            fontWeight: 600,
            width: "fit-content",
            color: isBlocked ? "#6b7280" : "#111827",
          }}
        >
          Seleccionar PDF
          <input
            type="file"
            accept="application/pdf"
            disabled={isBlocked}
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setFile(e.target.files[0]);
                setError("");
              }
            }}
            style={{ display: "none" }}
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
            type="button"
            onClick={analizarPDF}
            disabled={cargando || isBlocked}
            style={{
              background: cargando || isBlocked ? "#93c5fd" : "#1d4ed8",
              color: "white",
              padding: "12px 18px",
              borderRadius: "10px",
              border: "none",
              cursor: cargando || isBlocked ? "not-allowed" : "pointer",
              fontWeight: 600,
            }}
          >
            {isBlocked
              ? "Límite alcanzado"
              : cargando
              ? "Analizando PDF..."
              : "Analizar PDF"}
          </button>

          {error && (
            <span style={{ color: "#b91c1c", fontSize: "14px" }}>{error}</span>
          )}
        </div>
      </section>

      {limitReached && !isPro && (
        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "28px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <h2 style={{ margin: 0 }}>Has llegado al límite del plan gratuito</h2>

          <p style={{ color: "#6b7280", lineHeight: 1.6 }}>
            Ya utilizaste los <strong>3 análisis gratuitos</strong>. Puedes
            actualizar a <strong>SimpleUS Pro</strong> para seguir analizando
            cartas sin límite.
          </p>

          <Link
            href="/pro"
            style={{
              display: "inline-block",
              marginTop: "10px",
              background: "#1d4ed8",
              color: "white",
              padding: "14px 18px",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: 700,
              width: "fit-content",
            }}
          >
            Ver SimpleUS Pro
          </Link>
        </section>
      )}

      {resultado && urgenciaStyles && (
        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "28px",
            display: "flex",
            flexDirection: "column",
            gap: "22px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <h2 style={{ margin: 0 }}>Mapa SimpleUS</h2>

            <span
              style={{
                background: urgenciaStyles.bg,
                color: urgenciaStyles.color,
                padding: "8px 12px",
                borderRadius: "999px",
                fontWeight: 700,
                fontSize: "13px",
              }}
            >
              {urgenciaStyles.label}
            </span>
          </div>

          <div>
            <strong>Qué es esta carta</strong>
            <p style={{ marginTop: "8px", color: "#4b5563" }}>
              {resultado.tipo}
            </p>
          </div>

          <div>
            <strong>Qué significa</strong>
            <p style={{ marginTop: "8px", color: "#4b5563" }}>
              {resultado.significado}
            </p>
          </div>

          <div>
            <strong>Nivel de urgencia</strong>
            <p style={{ marginTop: "8px", color: "#4b5563" }}>
              {resultado.urgencia}
            </p>
          </div>

          <div>
            <strong>Qué podrías hacer</strong>
            <ul style={{ marginTop: "8px", color: "#4b5563" }}>
              {resultado.pasos.map((paso, index) => (
                <li key={index}>{paso}</li>
              ))}
            </ul>
          </div>

          <div
            style={{
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: "14px",
              padding: "18px",
            }}
          >
            <strong style={{ color: "#1d4ed8" }}>Mensaje de calma</strong>
            <p style={{ marginTop: "10px", color: "#1e3a8a" }}>
              {resultado.calma}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
