"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ChecklistBox from "@/components/ChecklistBox";

type ResultadoMapa = {
  tipo: string;
  significado: string;
  urgencia: string;
  pasos: string[];
  checklist?: string[];
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

function calcularDiasRestantes(trialStartedAt: string | null) {
  if (!trialStartedAt) return 0;

  const inicio = new Date(trialStartedAt).getTime();
  const ahora = Date.now();
  const diffMs = ahora - inicio;
  const diffDias = diffMs / (1000 * 60 * 60 * 24);
  const restantes = Math.ceil(7 - diffDias);

  return Math.max(restantes, 0);
}

export default function PdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [resultado, setResultado] = useState<ResultadoMapa | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [limitReached, setLimitReached] = useState(false);
  const [analysisCount, setAnalysisCount] = useState(0);
  const [plan, setPlan] = useState<"free" | "pro">("free");
  const [bonusAnalyses, setBonusAnalyses] = useState(0);
  const [trialStartedAt, setTrialStartedAt] = useState<string | null>(null);

  const isPro = plan === "pro";
  const trialDaysRemaining = calcularDiasRestantes(trialStartedAt);
  const isTrialActive = trialDaysRemaining > 0;

  const bonusRemaining = Math.max(bonusAnalyses - analysisCount, 0);

  const isBlocked = !isPro && !isTrialActive && bonusRemaining <= 0;

  async function cargarConteoYPlan() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setPlan("free");
      setBonusAnalyses(0);
      setTrialStartedAt(null);
      setAnalysisCount(0);
      setLimitReached(false);
      return;
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("plan, bonus_analyses, trial_started_at")
      .eq("id", user.id)
      .maybeSingle();

    const nextPlan =
      !profileError && profileData?.plan === "pro" ? "pro" : "free";
    const nextBonus = profileData?.bonus_analyses ?? 0;
    const nextTrialStartedAt = profileData?.trial_started_at ?? null;

    setPlan(nextPlan);
    setBonusAnalyses(nextBonus);
    setTrialStartedAt(nextTrialStartedAt);

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

    const nextTrialDaysRemaining = calcularDiasRestantes(nextTrialStartedAt);
    const nextTrialActive = nextTrialDaysRemaining > 0;
    const nextBonusRemaining = Math.max(nextBonus - nextCount, 0);

    if (nextPlan === "pro") {
      setLimitReached(false);
    } else {
      setLimitReached(!nextTrialActive && nextBonusRemaining <= 0);
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
            ) : isTrialActive ? (
              <>
                Plan gratuito: <strong>prueba activa</strong> · análisis ilimitados
                por {trialDaysRemaining} día{trialDaysRemaining === 1 ? "" : "s"}
                {bonusAnalyses > 0 && (
                  <span style={{ marginLeft: "8px", color: "#1d4ed8" }}>
                    (+{bonusAnalyses} análisis extra acumulados por referidos para
                    después de la prueba)
                  </span>
                )}
              </>
            ) : (
              <>
                Plan gratuito: <strong>prueba finalizada</strong>
                {bonusAnalyses > 0 && (
                  <span style={{ marginLeft: "8px", color: "#1d4ed8" }}>
                    · {bonusRemaining} de {bonusAnalyses} análisis extra disponibles
                    por referidos
                  </span>
                )}
              </>
            )}
          </div>

          {!isPro && (
            <div
              style={{
                background: isTrialActive ? "#eff6ff" : "#fff7ed",
                border: isTrialActive ? "1px solid #bfdbfe" : "1px solid #fdba74",
                borderRadius: "12px",
                padding: "14px 16px",
                color: isTrialActive ? "#1e3a8a" : "#9a3412",
                lineHeight: 1.6,
                margin: "0 0 12px 0",
                fontSize: "14px",
              }}
            >
              {isTrialActive ? (
                <>
                  Tu prueba gratuita de <strong>7 días</strong> sigue activa.
                  Durante este periodo puedes analizar cartas <strong>sin límite</strong>.
                </>
              ) : (
                <>
                  Tu prueba gratuita de <strong>7 días</strong> ya terminó.
                  Durante ese tiempo podías analizar cartas sin límite. Ahora puedes
                  seguir usando SimpleUS con análisis ganados por referidos o pasar
                  a <strong> PRO</strong>.
                </>
              )}
            </div>
          )}

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
            Ya no tienes análisis disponibles en tu plan actual. Para seguir
            analizando cartas en PDF, puedes invitar personas o activar
            SimpleUS Pro.
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
              ? "Acceso bloqueado"
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
          <h2 style={{ margin: 0 }}>
            {isTrialActive
              ? "Tu prueba gratuita sigue activa"
              : "Tu prueba gratuita ya terminó"}
          </h2>

          <p style={{ color: "#6b7280", lineHeight: 1.6 }}>
            {isTrialActive ? (
              <>
                Durante tu prueba gratuita de 7 días puedes analizar cartas
                sin límite.
              </>
            ) : bonusAnalyses > 0 ? (
              <>
                Tu prueba gratuita de 7 días ya terminó. Ahora puedes seguir usando
                tus <strong>{bonusRemaining}</strong> análisis ganados por referidos
                o actualizar a <strong>SimpleUS Pro</strong>.
              </>
            ) : (
              <>
                Tu prueba gratuita de 7 días ya terminó. Ahora puedes seguir usando
                análisis ganados por referidos o actualizar a
                <strong> SimpleUS Pro</strong>.
              </>
            )}
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
            <ul style={{ marginTop: "8px", color: "#4b5563", lineHeight: 1.8 }}>
              {resultado.pasos.map((paso, index) => (
                <li key={index}>{paso}</li>
              ))}
            </ul>
          </div>

          <ChecklistBox items={resultado.checklist} />

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