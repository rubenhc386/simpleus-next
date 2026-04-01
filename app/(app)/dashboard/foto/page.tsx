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
  lugar?: string;
  oficial?: boolean;
  riesgo?: string;
  motivo?: string;
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
function getRiesgoStyles(riesgo?: string) {
  const value = (riesgo || "").toLowerCase();

  if (value.includes("alto")) {
    return {
      bg: "#fee2e2",
      border: "#fca5a5",
      color: "#991b1b",
      label: "Riesgo alto",
    };
  }

  if (value.includes("medio")) {
    return {
      bg: "#fef3c7",
      border: "#fcd34d",
      color: "#92400e",
      label: "Riesgo medio",
    };
  }

  return {
    bg: "#ecfdf5",
    border: "#86efac",
    color: "#166534",
    label: "Riesgo bajo",
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

export default function FotoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [resultado, setResultado] = useState<ResultadoMapa | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [limitReached, setLimitReached] = useState(false);
  const [analysisCount, setAnalysisCount] = useState(0);
  const [plan, setPlan] = useState<"free" | "pro" | null>(null);
  const [bonusAnalyses, setBonusAnalyses] = useState(0);
  const [trialStartedAt, setTrialStartedAt] = useState<string | null>(null);

  const isPro = plan === "pro";
  const trialDaysRemaining = calcularDiasRestantes(trialStartedAt);
  const isTrialActive = trialDaysRemaining > 0;
  const isPlanLoading = plan === null;
  const bonusRemaining = Math.max(bonusAnalyses - analysisCount, 0);

  const isBlocked =
    !isPlanLoading &&
    !isPro &&
    !isTrialActive &&
    bonusRemaining <= 0;

  async function cargarConteoYPlan() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setPlan(null);
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
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (countError) {
      console.error("Error cargando conteo de foto:", countError);
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

  async function convertirABase64(fileToConvert: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(fileToConvert);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  }

  async function analizarFoto() {
    if (isBlocked) {
      setLimitReached(true);
      setResultado(null);
      setError("");
      return;
    }

    if (!file) {
      setError("Selecciona primero una imagen.");
      return;
    }

    try {
      setCargando(true);
      setError("");
      setResultado({
        tipo: "Analizando foto...",
        significado: "Estamos revisando la imagen para generar tu Mapa SimpleUS.",
        urgencia: "Calculando...",
        pasos: [],
        checklist: [],
        calma: "Espera un momento mientras procesamos la foto.",
        modo: "real",
      });
      setLimitReached(false);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("No se encontró una sesión activa.");
      }

      const imageBase64 = await convertirABase64(file);

      const res = await fetch("/api/analyze-photo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64,
          userId: user.id,
        }),
      });

      let data: any = null;

      try {
        data = await res.json();
      } catch {
        throw new Error("El servidor devolvió una respuesta inválida.");
      }

      if (data?.limitReached && !isPro) {
        setLimitReached(true);
        return;
      }

      if (!res.ok) {
        throw new Error(data?.error || "No se pudo analizar la foto.");
      }

      setResultado(data);
      setAnalysisCount((prev) => prev + 1);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Ocurrió un error al analizar la foto.";

      setError(message);
    } finally {
      setCargando(false);
    }
  }

  const urgenciaStyles = resultado
    ? getUrgenciaStyles(resultado.urgencia)
    : null;
const riesgoStyles = resultado ? getRiesgoStyles(resultado.riesgo) : null;
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
            Analizar carta con foto
          </h1>

          <div
            style={{
              background: isPlanLoading
                ? "#f9fafb"
                : isPro
                ? "#ecfdf5"
                : isBlocked
                ? "#fff7ed"
                : "#f9fafb",
              border: isPlanLoading
                ? "1px solid #e5e7eb"
                : isPro
                ? "1px solid #86efac"
                : isBlocked
                ? "1px solid #fdba74"
                : "1px solid #e5e7eb",
              borderRadius: "10px",
              padding: "10px 14px",
              fontSize: "14px",
              color: isPlanLoading
                ? "#6b7280"
                : isPro
                ? "#166534"
                : isBlocked
                ? "#9a3412"
                : "#374151",
              width: "fit-content",
              fontWeight: 600,
              marginBottom: "12px",
            }}
          >
            {isPlanLoading ? (
              <>Cargando tu cuenta...</>
            ) : isPro ? (
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

          {!isPro && !isPlanLoading && (
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
            Sube una foto de la carta y SimpleUS intentará entenderla para
            generar un Mapa SimpleUS.
          </p>
        </div>

        {isBlocked && !isPro && !isPlanLoading && (
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
            analizando cartas con foto, puedes invitar personas o activar
            SimpleUS Pro.
          </div>
        )}

        <label
          style={{
            display: "inline-block",
            background: isBlocked ? "#e5e7eb" : "#f3f4f6",
            border: "1px solid #d1d5db",
            padding: "12px 16px",
            borderRadius: "10px",
            cursor: isBlocked ? "not-allowed" : "pointer",
            width: "fit-content",
            fontWeight: 600,
            color: isBlocked ? "#6b7280" : "#111827",
          }}
        >
          Seleccionar imagen
          <input
            type="file"
            accept="image/*"
            disabled={isBlocked}
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
            type="button"
            onClick={analizarFoto}
            disabled={cargando || isBlocked}
            style={{
              background: cargando || isBlocked ? "#93c5fd" : "#1d4ed8",
              color: "white",
              padding: "12px 18px",
              borderRadius: "10px",
              border: "none",
              cursor: cargando || isBlocked ? "not-allowed" : "pointer",
              fontWeight: 600,
              opacity: cargando ? 0.7 : 1,
              transition: "all 0.2s ease",
            }}
          >
            {isBlocked
              ? "Acceso bloqueado"
              : cargando
              ? "Analizando foto..."
              : "Analizar foto"}
          </button>

          {error && (
            <span style={{ color: "#b91c1c", fontSize: "14px" }}>{error}</span>
          )}
        </div>
      </section>

      {limitReached && !isPro && !isPlanLoading && (
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

{resultado.lugar && (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    }}
  >
    <div>
      <strong>Lugar sugerido</strong>
      <p style={{ marginTop: "8px", color: "#4b5563" }}>
        {resultado.lugar}
      </p>
    </div>

    <div
      style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
      }}
    >
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          resultado.lugar
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          background: "#1d4ed8",
          color: "#ffffff",
          padding: "10px 14px",
          borderRadius: "10px",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        Abrir en Google Maps
      </a>
    </div>

    <div
      style={{
        borderRadius: "14px",
        overflow: "hidden",
        border: "1px solid #e5e7eb",
      }}
    >
      <iframe
        title="Mapa del lugar sugerido"
        width="100%"
        height="260"
        loading="lazy"
        style={{ border: 0 }}
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps?q=${encodeURIComponent(
          resultado.lugar
        )}&output=embed`}
      />
    </div>
  </div>
)}
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