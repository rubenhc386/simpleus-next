"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type AnalysisRow = {
  id: string;
  created_at: string;
  tipo: string | null;
  urgencia: string | null;
  user_id: string | null;
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [ultimos, setUltimos] = useState<AnalysisRow[]>([]);
  const [plan, setPlan] = useState<"free" | "pro">("free");
  const [cargandoPago, setCargandoPago] = useState(false);
  const [mensajePago, setMensajePago] = useState("");

  useEffect(() => {
    let active = true;

    async function cargarDashboard() {
      try {
        setLoading(true);

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          if (active) {
            setPlan("free");
            setCount(0);
            setUltimos([]);
            setLoading(false);
          }
          return;
        }

        const user = session.user;

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("plan")
          .eq("id", user.id)
          .single();

        if (!active) return;

        if (!profileError && profileData?.plan === "pro") {
          setPlan("pro");
        } else {
          setPlan("free");
        }

        const { data, error } = await supabase
          .from("analyses")
          .select("id, created_at, tipo, urgencia, user_id")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error cargando dashboard:", error);
          if (active) {
            setCount(0);
            setUltimos([]);
            setLoading(false);
          }
          return;
        }

        if (!active) return;

        const rows = data ?? [];
        setCount(rows.length);
        setUltimos(rows.slice(0, 3));
      } catch (error) {
        console.error("Error general cargando dashboard:", error);
        if (active) {
          setPlan("free");
          setCount(0);
          setUltimos([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    cargarDashboard();

    return () => {
      active = false;
    };
  }, []);

  async function activarPro() {
    try {
      setCargandoPago(true);
      setMensajePago("");

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw new Error("No se pudo leer la sesión actual.");
      }

      if (!session?.access_token) {
        throw new Error("No se encontró una sesión activa.");
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      let data: any = null;

      try {
        data = await res.json();
      } catch {
        throw new Error("El servidor devolvió una respuesta inválida.");
      }

      if (!res.ok) {
        throw new Error(data?.error || "No se pudo iniciar el pago.");
      }

      if (!data?.url) {
        throw new Error("Stripe no devolvió una URL de pago.");
      }

      window.location.href = data.url;
    } catch (error) {
      const texto =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al iniciar el pago.";

      setMensajePago(texto);
      console.error("Error en activarPro:", error);
    } finally {
      setCargandoPago(false);
    }
  }

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
          Dashboard principal
        </div>

        <h1 style={{ fontSize: "34px", margin: 0 }}>
          Bienvenido a SimpleUS
        </h1>

        <p style={{ color: "#6b7280", lineHeight: 1.7, margin: 0 }}>
          Desde aquí puedes analizar cartas, revisar tu historial y seguir
          organizando tus documentos importantes en inglés.
        </p>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "16px",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "22px",
          }}
        >
          <strong style={{ fontSize: "18px" }}>Plan actual</strong>
          <p style={{ color: "#4b5563", lineHeight: 1.7, marginTop: "10px" }}>
            {plan === "pro" ? "PRO" : "Gratis"}
          </p>
          <p style={{ color: "#6b7280", lineHeight: 1.7, margin: 0 }}>
            {plan === "pro"
              ? "Tu acceso PRO ya está activo."
              : "Empieza con tus análisis iniciales y luego decide si quieres pasar a SimpleUS Pro."}
          </p>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "22px",
          }}
        >
          <strong style={{ fontSize: "18px" }}>Análisis guardados</strong>
          <p style={{ color: "#4b5563", lineHeight: 1.7, marginTop: "10px" }}>
            {loading ? "Cargando..." : count + " analisis"}
          </p>
          <p style={{ color: "#6b7280", lineHeight: 1.7, margin: 0 }}>
            Conteo basado en tu historial guardado dentro de tu cuenta.
          </p>
        </div>

        {plan === "pro" ? (
          <div
            style={{
              background: "#ecfdf5",
              border: "1px solid #86efac",
              borderRadius: "16px",
              padding: "22px",
            }}
          >
            <strong style={{ fontSize: "18px", color: "#166534" }}>
              SimpleUS Pro activo
            </strong>
            <p
              style={{
                color: "#166534",
                lineHeight: 1.7,
                marginTop: "10px",
                marginBottom: 0,
              }}
            >
              Ya tienes acceso PRO activo. Disfruta una experiencia más completa
              dentro de SimpleUS.
            </p>
          </div>
        ) : (
          <div
            style={{
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: "16px",
              padding: "22px",
            }}
          >
            <strong style={{ fontSize: "18px", color: "#1d4ed8" }}>
              SimpleUS Pro
            </strong>
            <p
              style={{
                color: "#1e3a8a",
                lineHeight: 1.7,
                marginTop: "10px",
                marginBottom: "12px",
              }}
            >
              Desbloquea mas analisis y una experiencia mas completa.
            </p>

            <button
              type="button"
              onClick={activarPro}
              disabled={cargandoPago}
              style={{
                display: "inline-block",
                background: cargandoPago ? "#93c5fd" : "#1d4ed8",
                color: "#ffffff",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "none",
                fontWeight: 700,
                cursor: cargandoPago ? "not-allowed" : "pointer",
              }}
            >
              {cargandoPago ? "Redirigiendo..." : "Activar PRO"}
            </button>

            {mensajePago && (
              <div
                style={{
                  marginTop: "10px",
                  color: "#b91c1c",
                  fontSize: "14px",
                  lineHeight: 1.5,
                }}
              >
                {mensajePago}
              </div>
            )}
          </div>
        )}
      </section>

      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        <h2 style={{ fontSize: "26px", margin: 0 }}>Accesos rapidos</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          <Link
            href="/dashboard/analizar"
            style={{
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              padding: "20px",
              textDecoration: "none",
              color: "#111827",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <strong>Analizar texto</strong>
            <span style={{ color: "#6b7280", lineHeight: 1.6 }}>
              Pega el contenido de una carta y recibe tu Mapa SimpleUS.
            </span>
          </Link>

          <Link
            href="/dashboard/foto"
            style={{
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              padding: "20px",
              textDecoration: "none",
              color: "#111827",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <strong>Analizar foto</strong>
            <span style={{ color: "#6b7280", lineHeight: 1.6 }}>
              Sube una imagen de la carta y deja que SimpleUS la interprete.
            </span>
          </Link>

          <Link
            href="/dashboard/pdf"
            style={{
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              padding: "20px",
              textDecoration: "none",
              color: "#111827",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <strong>Analizar PDF</strong>
            <span style={{ color: "#6b7280", lineHeight: 1.6 }}>
              Sube un PDF con texto. Esta funcion sigue en evolucion.
            </span>
          </Link>

          <Link
            href="/dashboard/historial"
            style={{
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              padding: "20px",
              textDecoration: "none",
              color: "#111827",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <strong>Ver historial</strong>
            <span style={{ color: "#6b7280", lineHeight: 1.6 }}>
              Revisa tus analisis anteriores desde una sola pantalla.
            </span>
          </Link>
        </div>
      </section>

      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "28px",
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
          <h2 style={{ fontSize: "26px", margin: 0 }}>Ultimos analisis</h2>

          <Link
            href="/dashboard/historial"
            style={{
              color: "#1d4ed8",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Ver todo
          </Link>
        </div>

        {loading ? (
          <p style={{ color: "#6b7280", margin: 0 }}>Cargando historial...</p>
        ) : ultimos.length === 0 ? (
          <p style={{ color: "#6b7280", margin: 0 }}>
            Aun no tienes analisis guardados.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
            }}
          >
            {ultimos.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "14px",
                  padding: "18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <strong>{item.tipo || "Analisis sin titulo"}</strong>
                <span style={{ color: "#6b7280", fontSize: "14px" }}>
                  {new Date(item.created_at).toLocaleString()}
                </span>
                <span style={{ color: "#4b5563" }}>
                  Urgencia: {item.urgencia || "No definida"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
