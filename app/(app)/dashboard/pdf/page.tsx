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
      console.error("Error conteo PDF:", countError);
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
        throw new Error("Respuesta inválida del servidor.");
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
          : "Error al analizar el PDF.";
      setError(message);
    } finally {
      setCargando(false);
    }
  }

  const urgenciaStyles = resultado
    ? getUrgenciaStyles(resultado.urgencia)
    : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", paddingTop: "40px", paddingBottom: "40px" }}>

      <section style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "28px", display: "flex", flexDirection: "column", gap: "16px" }}>
        
        <h1 style={{ fontSize: "32px", margin: 0 }}>
          Analizar carta en PDF
        </h1>

        <div
          style={{
            background: isPro ? "#ecfdf5" : isBlocked ? "#fff7ed" : "#f9fafb",
            border: isPro ? "1px solid #86efac" : isBlocked ? "1px solid #fdba74" : "1px solid #e5e7eb",
            borderRadius: "10px",
            padding: "10px 14px",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {isPro ? (
            <>Plan <strong>PRO activo</strong></>
          ) : (
            <>
              Plan gratuito: {analysisCount} de {realFreeLimit}
              {bonusAnalyses > 0 && (
                <span style={{ marginLeft: 8, color: "#1d4ed8" }}>
                  (+{bonusAnalyses} por referidos)
                </span>
              )}
            </>
          )}
        </div>

        {isBlocked && !isPro && (
          <div style={{ background: "#fff7ed", border: "1px solid #fdba74", borderRadius: "12px", padding: "14px 16px", color: "#9a3412" }}>
            Ya alcanzaste tu límite actual. Activa PRO para continuar.
          </div>
        )}

        <input
          type="file"
          accept="application/pdf"
          disabled={isBlocked}
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button
          onClick={analizarPDF}
          disabled={cargando || isBlocked}
          style={{
            background: cargando || isBlocked ? "#93c5fd" : "#1d4ed8",
            color: "white",
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            cursor: cargando || isBlocked ? "not-allowed" : "pointer",
          }}
        >
          {isBlocked ? "Límite alcanzado" : cargando ? "Analizando..." : "Analizar PDF"}
        </button>

        {error && <span style={{ color: "#b91c1c" }}>{error}</span>}
      </section>

      {resultado && urgenciaStyles && (
        <section style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "28px" }}>
          
          <h2>Mapa SimpleUS</h2>

          <p><strong>{resultado.tipo}</strong></p>
          <p>{resultado.significado}</p>
          <p>{resultado.urgencia}</p>

        </section>
      )}
    </div>
  );
}
