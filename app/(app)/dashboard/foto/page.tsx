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

export default function FotoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [resultado, setResultado] = useState<ResultadoMapa | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [limitReached, setLimitReached] = useState(false);
  const [analysisCount, setAnalysisCount] = useState(0);
  const [plan, setPlan] = useState<"free" | "pro">("free");
  const [bonusAnalyses, setBonusAnalyses] = useState(0);

  const freeLimit = 3;
  const realFreeLimit = freeLimit + bonusAnalyses;
  const isPro = plan === "pro";
  const isBlocked = !isPro && analysisCount >= realFreeLimit;

  async function cargarConteoYPlan() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setPlan("free");
      setBonusAnalyses(0);
      setAnalysisCount(0);
      setLimitReached(false);
      return;
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("plan, bonus_analyses")
      .eq("id", user.id)
      .maybeSingle();

    const nextPlan =
      !profileError && profileData?.plan === "pro" ? "pro" : "free";
    const nextBonus = profileData?.bonus_analyses ?? 0;

    setPlan(nextPlan);
    setBonusAnalyses(nextBonus);

    const { count, error: countError } = await supabase
      .from("analyses")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (countError) {
      console.error("Error cargando conteo de foto:", countError);
      return;
    }

    const nextCount = count ?? 0;
    setAnalysisCount(nextCount);

    if (nextPlan === "pro") {
      setLimitReached(false);
    } else {
      setLimitReached(nextCount >= freeLimit + nextBonus);
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
      setResultado(null);
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
        await cargarConteoYPlan();
        return;
      }

      if (!res.ok) {
        throw new Error(data?.error || "No se pudo analizar la foto.");
      }

      setResultado(data);
      await cargarConteoYPlan();
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
          <p style={{ color: "#6b7280", lineHeight: 1.6, margin: 0 }}>
            Sube una foto de la carta y SimpleUS intentará entenderla para
            generar un Mapa SimpleUS.
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
            <>
              Plan gratuito: {analysisCount} de {realFreeLimit} análisis usados
              {bonusAnalyses > 0 && (
                <span style={{ marginLeft: "8px", color: "#1d4ed8" }}>
                  (+{bonusAnalyses} de regalo por referidos)
                </span>
              )}
            </>
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
            Ya alcanzaste tu límite actual del plan gratuito. Para seguir
            analizando cartas por foto, necesitaremos activar SimpleUS Pro.
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
            }}
          >
            {isBlocked
              ? "Límite alcanzado"
              : cargando
              ? "Analizando foto..."
              : "Analizar foto"}
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
          <h2 style={{ margin: 0 }}>Has llegado al límite de tu plan gratuito</h2>

          <p style={{ color: "#6b7280", lineHeight: 1.6 }}>
            Ya utilizaste tus <strong>{realFreeLimit} análisis disponibles</strong>.
            Puedes actualizar a <strong>SimpleUS Pro</strong> para seguir
            analizando cartas sin límite.
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
                <li>{realFreeLimit} análisis disponibles</li>
                <li>Subir foto</li>
                <li>Historial básico</li>
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
                <li>Análisis ilimitados</li>
                <li>Subir fotos de cartas</li>
                <li>Analizar PDFs</li>
                <li>Historial completo</li>
                <li>Explicaciones claras en español</li>
              </ul>
            </div>
          </div>

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
