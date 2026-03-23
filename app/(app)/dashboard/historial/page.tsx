"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type AnalysisRow = {
  id: string;
  created_at: string;
  tipo: string | null;
  significado: string | null;
  urgencia: string | null;
  pasos: string[] | null;
  calma: string | null;
  original_text: string | null;
  modo: string | null;
  user_id: string | null;
};

function getUrgenciaStyles(urgencia: string | null) {
  const value = (urgencia || "").toLowerCase();

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

export default function HistorialPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<AnalysisRow[]>([]);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function cargarHistorial() {
    try {
      setLoading(true);
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setItems([]);
        return;
      }

      const { data, error: dbError } = await supabase
        .from("analyses")
        .select(
          "id, created_at, tipo, significado, urgencia, pasos, calma, original_text, modo, user_id"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (dbError) {
        console.error("Error cargando historial:", dbError);
        setError("No se pudo cargar el historial.");
        return;
      }

      setItems(data ?? []);
    } catch (err) {
      console.error("Error general cargando historial:", err);
      setError("Ocurrio un error al cargar el historial.");
    } finally {
      setLoading(false);
    }
  }

  async function eliminarAnalisis(id: string) {
    try {
      setDeletingId(id);

      const { error: deleteError } = await supabase
        .from("analyses")
        .delete()
        .eq("id", id);

      if (deleteError) {
        console.error("Error eliminando analisis:", deleteError);
        setError("No se pudo eliminar el analisis.");
        return;
      }

      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error general eliminando analisis:", err);
      setError("Ocurrio un error al eliminar el analisis.");
    } finally {
      setDeletingId(null);
    }
  }

  useEffect(() => {
    cargarHistorial();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "28px",
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
          gap: "12px",
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
          Historial de analisis
        </div>

        <h1 style={{ fontSize: "34px", margin: 0 }}>Tu historial en SimpleUS</h1>

        <p style={{ color: "#6b7280", lineHeight: 1.7, margin: 0 }}>
          Aqui puedes revisar los analisis que ya has guardado dentro de tu
          cuenta.
        </p>
      </section>

      {error && (
        <section
          style={{
            background: "#ffffff",
            border: "1px solid #fecaca",
            color: "#991b1b",
            borderRadius: "16px",
            padding: "18px",
          }}
        >
          {error}
        </section>
      )}

      {loading ? (
        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "28px",
          }}
        >
          Cargando historial...
        </section>
      ) : items.length === 0 ? (
        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "28px",
            color: "#6b7280",
            lineHeight: 1.7,
          }}
        >
          Todavia no tienes analisis guardados. Cuando analices una carta, la
          veras aqui.
        </section>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          {items.map((item) => {
            const urgenciaStyles = getUrgenciaStyles(item.urgencia);

            return (
              <section
                key={item.id}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "16px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h2 style={{ margin: 0, fontSize: "22px" }}>
                      {item.tipo || "Analisis sin titulo"}
                    </h2>

                    <div
                      style={{
                        color: "#6b7280",
                        fontSize: "14px",
                        marginTop: "6px",
                      }}
                    >
                      {new Date(item.created_at).toLocaleString()}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    {item.modo && (
                      <span
                        style={{
                          background: item.modo === "real" ? "#dbeafe" : "#f3f4f6",
                          color: item.modo === "real" ? "#1d4ed8" : "#374151",
                          padding: "8px 12px",
                          borderRadius: "999px",
                          fontWeight: 700,
                          fontSize: "13px",
                        }}
                      >
                        Modo: {item.modo}
                      </span>
                    )}

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
                </div>

                <div>
                  <strong>Que significa</strong>
                  <p
                    style={{
                      marginTop: "8px",
                      color: "#4b5563",
                      lineHeight: 1.7,
                    }}
                  >
                    {item.significado || "Sin explicacion disponible."}
                  </p>
                </div>

                <div>
                  <strong>Que podrias hacer</strong>
                  {item.pasos && item.pasos.length > 0 ? (
                    <ul
                      style={{
                        marginTop: "8px",
                        color: "#4b5563",
                        lineHeight: 1.8,
                      }}
                    >
                      {item.pasos.map((paso, index) => (
                        <li key={index}>{paso}</li>
                      ))}
                    </ul>
                  ) : (
                    <p
                      style={{
                        marginTop: "8px",
                        color: "#6b7280",
                        lineHeight: 1.7,
                      }}
                    >
                      No hay pasos guardados.
                    </p>
                  )}
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
                  <p
                    style={{
                      marginTop: "10px",
                      color: "#1e3a8a",
                      lineHeight: 1.7,
                    }}
                  >
                    {item.calma || "Sin mensaje de calma guardado."}
                  </p>
                </div>

                <details
                  style={{
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "14px 16px",
                  }}
                >
                  <summary
                    style={{
                      cursor: "pointer",
                      fontWeight: 700,
                      color: "#111827",
                    }}
                  >
                    Ver texto original
                  </summary>

                  <div
                    style={{
                      marginTop: "12px",
                      color: "#4b5563",
                      lineHeight: 1.7,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {item.original_text || "No se guardo texto original."}
                  </div>
                </details>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => eliminarAnalisis(item.id)}
                    disabled={deletingId === item.id}
                    style={{
                      background: "#ffffff",
                      color: "#991b1b",
                      border: "1px solid #fecaca",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      fontWeight: 700,
                      cursor:
                        deletingId === item.id ? "not-allowed" : "pointer",
                    }}
                  >
                    {deletingId === item.id ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
