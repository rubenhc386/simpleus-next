"use client";

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

export default function Page() {
  const [texto, setTexto] = useState("");
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

    const nextPlan = !profileError && profileData?.plan === "pro" ? "pro" : "free";
    setPlan(nextPlan);

    const { count, error: countError } = await supabase
      .from("analyses")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (countError) {
      console.error("Error cargando conteo:", countError);
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

  async function analizarCarta() {
    if (isBlocked) {
      setLimitReached(true);
      setError("");
      setResultado(null);
      return;
    }

    if (!texto.trim()) {
      setError("Pega primero el texto de una carta.");
      setResultado(null);
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
        throw new Error("No se encontro una sesion activa.");
      }

      const res = await fetch("/api/analyze-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          texto,
          userId: user.id,
        }),
      });

      const data = await res.json();

      if (data?.limitReached && !isPro) {
        setLimitReached(true);
        await cargarConteoYPlan();
        return;
      }

      if (!res.ok) {
        throw new Error(data?.error || "No se pudo analizar la carta.");
      }

      setResultado(data);
      await cargarConteoYPlan();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Ocurrio un error al analizar la carta.";

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
            Analizar carta
          </h1>

          <p
            style={{
              color: "#6b7280",
              lineHeight: 1.7,
              maxWidth: "760px",
              margin: 0,
            }}
          >
            Pega el texto de una carta en ingles y SimpleUS generara un Mapa
            SimpleUS para ayudarte a entender que es, que significa, que tan
            urgente parece y que podrias considerar hacer.
          </p>
        </div>

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
            borderRadius: "12px",
            padding: "14px 16px",
            color: isPro ? "#166534" : isBlocked ? "#9a3412" : "#374151",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {isPro ? (
            <>Plan <strong>PRO activo</strong></>
          ) : (
            <>Plan gratuito: {analysisCount} de {freeLimit} analisis usados</>
          )}
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
            Ya alcanzaste el limite del plan gratuito. Para seguir analizando
            cartas, necesitaremos activar SimpleUS Pro.
          </div>
        )}

        <textarea
          placeholder="Pega aqui el texto de la carta que recibiste..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={12}
          disabled={isBlocked}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid #d1d5db",
            resize: "vertical",
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: "15px",
            lineHeight: 1.5,
            background: isBlocked ? "#f9fafb" : "#ffffff",
            color: isBlocked ? "#6b7280" : "#111827",
          }}
        />

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
            onClick={analizarCarta}
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
              ? "Limite alcanzado"
              : cargando
              ? "Analizando..."
              : "Analizar carta"}
          </button>

          {resultado?.modo && (
            <span
              style={{
                fontSize: "13px",
                padding: "6px 10px",
                borderRadius: "999px",
                background: resultado.modo === "real" ? "#dbeafe" : "#f3f4f6",
                color: resultado.modo === "real" ? "#1d4ed8" : "#374151",
                fontWeight: 600,
              }}
            >
              Modo: {resultado.modo}
            </span>
          )}

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
          <h2 style={{ margin: 0 }}>Has llegado al limite del plan gratuito</h2>

          <p style={{ color: "#6b7280", lineHeight: 1.6 }}>
            Ya utilizaste los <strong>3 analisis gratuitos</strong>. Puedes
            actualizar a <strong>SimpleUS Pro</strong> para seguir analizando
            cartas sin limite.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "20px",
            }}
          >
            <div
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: "18px",
              }}
            >
              <strong>Plan gratuito</strong>
              <ul style={{ marginTop: "10px", lineHeight: 1.8 }}>
                <li>3 analisis de cartas</li>
                <li>Subir texto</li>
                <li>Historial basico</li>
              </ul>
            </div>

            <div
              style={{
                border: "2px solid #1d4ed8",
                borderRadius: "12px",
                padding: "18px",
                background: "#eff6ff",
              }}
            >
              <strong>SimpleUS Pro</strong>
              <p style={{ fontSize: "20px", fontWeight: 700 }}>$8.99 / mes</p>
              <ul style={{ marginTop: "10px", lineHeight: 1.8 }}>
                <li>Analisis ilimitados</li>
                <li>Subir fotos de cartas</li>
                <li>Analizar PDFs</li>
                <li>Historial completo</li>
                <li>Explicaciones claras en espanol</li>
              </ul>
            </div>
          </div>

          <button
            type="button"
            style={{
              marginTop: "10px",
              background: "#1d4ed8",
              color: "white",
              padding: "14px",
              borderRadius: "10px",
              border: "none",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Proximamente disponible
          </button>

          <p style={{ fontSize: "13px", color: "#6b7280" }}>
            Estamos preparando el lanzamiento de SimpleUS Pro. Pronto podras
            desbloquear analisis ilimitados.
          </p>
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
            <strong>Que es esta carta</strong>
            <p style={{ marginTop: "8px", color: "#4b5563" }}>
              {resultado.tipo}
            </p>
          </div>

          <div>
            <strong>Que significa</strong>
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
            <strong>Que podrias hacer</strong>
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