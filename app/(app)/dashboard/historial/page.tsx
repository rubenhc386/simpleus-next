"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type AnalysisItem = {
  id: string;
  created_at: string;
  original_text: string;
  tipo: string;
  significado: string;
  urgencia: string;
  pasos: string[];
  calma: string;
  modo: string;
  user_id?: string | null;
};

export default function HistorialPage() {
  const [data, setData] = useState<AnalysisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarHistorial() {
      try {
        setLoading(true);
        setError("");

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          setError("No se pudo obtener el usuario actual.");
          return;
        }

        if (!user) {
          setError("No hay sesión activa.");
          return;
        }

        const { data: analyses, error: analysesError } = await supabase
          .from("analyses")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (analysesError) {
          setError("Error al cargar el historial.");
          return;
        }

        setData((analyses as AnalysisItem[]) || []);
      } catch {
        setError("Ocurrió un error al cargar el historial.");
      } finally {
        setLoading(false);
      }
    }

    cargarHistorial();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        paddingTop: "40px",
        paddingBottom: "40px",
      }}
    >
      <div>
        <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
          Historial de análisis
        </h1>
        <p style={{ color: "#6b7280", lineHeight: 1.6 }}>
          Aquí puedes ver las cartas que has analizado en tu cuenta de SimpleUS.
        </p>
      </div>

      {loading ? (
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          Cargando historial...
        </div>
      ) : error ? (
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "24px",
            color: "#b91c1c",
          }}
        >
          {error}
        </div>
      ) : data.length === 0 ? (
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          No hay análisis guardados todavía para esta cuenta.
        </div>
      ) : (
        data.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <div style={{ fontSize: "13px", color: "#6b7280" }}>
              {new Date(item.created_at).toLocaleString()}
            </div>

            <div>
              <strong>Qué es esta carta</strong>
              <p style={{ marginTop: "8px", color: "#4b5563" }}>{item.tipo}</p>
            </div>

            <div>
              <strong>Qué significa</strong>
              <p style={{ marginTop: "8px", color: "#4b5563" }}>
                {item.significado}
              </p>
            </div>

            <div>
              <strong>Nivel de urgencia</strong>
              <p style={{ marginTop: "8px", color: "#4b5563" }}>
                {item.urgencia}
              </p>
            </div>

            <div>
              <strong>Qué podrías hacer</strong>
              <ul style={{ marginTop: "8px", color: "#4b5563" }}>
                {item.pasos?.map((paso, index) => (
                  <li key={index}>{paso}</li>
                ))}
              </ul>
            </div>

            <div>
              <strong>Mensaje de calma</strong>
              <p style={{ marginTop: "8px", color: "#4b5563" }}>{item.calma}</p>
            </div>

            <div style={{ fontSize: "13px", color: "#6b7280" }}>
              Modo: {item.modo}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
