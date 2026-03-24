"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type AnalysisRow = {
  id: string;
  created_at: string;
  tipo: string | null;
  urgencia: string | null;
  user_id: string | null;
};

function calcularDiasRestantes(trialStartedAt: string | null) {
  if (!trialStartedAt) return 0;

  const inicio = new Date(trialStartedAt).getTime();
  const ahora = Date.now();
  const diffMs = ahora - inicio;
  const diffDias = diffMs / (1000 * 60 * 60 * 24);
  const restantes = Math.ceil(3 - diffDias);

  return Math.max(restantes, 0);
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [ultimos, setUltimos] = useState<AnalysisRow[]>([]);
  const [plan, setPlan] = useState<"free" | "pro">("free");
  const [cargandoPago, setCargandoPago] = useState(false);
  const [mensajePago, setMensajePago] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [affiliateCode, setAffiliateCode] = useState("");
  const [isAffiliate, setIsAffiliate] = useState(false);
  const [referralsCount, setReferralsCount] = useState(0);
  const [bonusAnalyses, setBonusAnalyses] = useState(0);
  const [copiado, setCopiado] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [trialStartedAt, setTrialStartedAt] = useState<string | null>(null);

  const [affiliateLeads, setAffiliateLeads] = useState(0);
  const [affiliatePaid, setAffiliatePaid] = useState(0);

  const freeLimit = 3;
  const isPro = plan === "pro";
  const trialDaysRemaining = calcularDiasRestantes(trialStartedAt);
  const isTrialActive = isPro || trialDaysRemaining > 0;

  const realFreeLimit = isPro
    ? Number.MAX_SAFE_INTEGER
    : isTrialActive
    ? freeLimit + bonusAnalyses
    : bonusAnalyses;

  const progressPercent = useMemo(() => {
    if (plan === "pro") return 100;
    const total = Math.max(realFreeLimit, 1);
    const used = Math.min(count, total);
    return Math.round((used / total) * 100);
  }, [count, plan, realFreeLimit]);

  const referralLink = isAffiliate
    ? affiliateCode
      ? `https://www.simpleus.app/?a=${affiliateCode}`
      : ""
    : referralCode
    ? `https://www.simpleus.app/?r=${referralCode}`
    : "";

  const nextReferralGoal =
    referralsCount < 1
      ? 1
      : referralsCount < 3
      ? 3
      : referralsCount < 5
      ? 5
      : referralsCount < 10
      ? 10
      : null;

  const referralsRemaining =
    nextReferralGoal !== null ? Math.max(nextReferralGoal - referralsCount, 0) : 0;

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
            setReferralCode("");
            setAffiliateCode("");
            setIsAffiliate(false);
            setReferralsCount(0);
            setBonusAnalyses(0);
            setUserEmail("");
            setTrialStartedAt(null);
            setAffiliateLeads(0);
            setAffiliatePaid(0);
            setLoading(false);
          }
          return;
        }

        const user = session.user;
        setUserEmail(user.email || "");

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select(
            "plan, referral_code, affiliate_code, is_affiliate, referrals_count, bonus_analyses, trial_started_at"
          )
          .eq("id", user.id)
          .single();

        if (!active) return;

        if (!profileError && profileData?.plan === "pro") {
          setPlan("pro");
        } else {
          setPlan("free");
        }

        const affiliateFlag = profileData?.is_affiliate === true;
        setIsAffiliate(affiliateFlag);

        let code = profileData?.referral_code;
        const affCode = profileData?.affiliate_code || "";

        if (!code) {
          code = Math.random().toString(36).substring(2, 8);

          const { error: updateError } = await supabase
            .from("profiles")
            .update({ referral_code: code })
            .eq("id", user.id);

          if (updateError) {
            console.error("Error generando referral_code:", updateError);
          }
        }

        setReferralCode(code || "");
        setAffiliateCode(affCode);
        setReferralsCount(profileData?.referrals_count || 0);
        setBonusAnalyses(profileData?.bonus_analyses || 0);
        setTrialStartedAt(profileData?.trial_started_at || null);

        if (affiliateFlag) {
          const { count: leadsCount, error: leadsError } = await supabase
            .from("affiliate_conversions")
            .select("*", { count: "exact", head: true })
            .eq("affiliate_id", user.id)
            .eq("status", "lead");

          if (leadsError) {
            console.error("Error contando leads afiliados:", leadsError);
          } else {
            setAffiliateLeads(leadsCount || 0);
          }

          const { count: paidCount, error: paidError } = await supabase
            .from("affiliate_conversions")
            .select("*", { count: "exact", head: true })
            .eq("affiliate_id", user.id)
            .eq("status", "paid");

          if (paidError) {
            console.error("Error contando paid afiliados:", paidError);
          } else {
            setAffiliatePaid(paidCount || 0);
          }
        } else {
          setAffiliateLeads(0);
          setAffiliatePaid(0);
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
          setReferralCode("");
          setAffiliateCode("");
          setIsAffiliate(false);
          setReferralsCount(0);
          setBonusAnalyses(0);
          setUserEmail("");
          setTrialStartedAt(null);
          setAffiliateLeads(0);
          setAffiliatePaid(0);
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

  async function copiarLinkReferido() {
    try {
      if (!referralLink) return;
      await navigator.clipboard.writeText(referralLink);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (error) {
      console.error("No se pudo copiar el link:", error);
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

        {userEmail && (
          <div
            style={{
              marginTop: "8px",
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "12px 14px",
              width: "fit-content",
              fontSize: "14px",
              color: "#374151",
            }}
          >
            Sesión actual: <strong>{userEmail}</strong>
          </div>
        )}
      </section>

      {isAffiliate && (
        <section
          style={{
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: "16px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#1d4ed8",
            }}
          >
            Programa de afiliados
          </div>

          <h2 style={{ margin: 0, fontSize: "28px", color: "#111827" }}>
            Tu panel rápido de afiliado
          </h2>

          <p style={{ margin: 0, color: "#1e3a8a", lineHeight: 1.7 }}>
            Comparte tu enlace, registra leads y convierte usuarios PRO.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
            }}
          >
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #dbeafe",
                borderRadius: "14px",
                padding: "18px",
              }}
            >
              <strong>Tu código</strong>
              <p style={{ margin: "10px 0 0 0", color: "#374151" }}>
                {affiliateCode || "Sin código"}
              </p>
            </div>

            <div
              style={{
                background: "#ffffff",
                border: "1px solid #dbeafe",
                borderRadius: "14px",
                padding: "18px",
              }}
            >
              <strong>Leads</strong>
              <p style={{ margin: "10px 0 0 0", color: "#374151" }}>
                {affiliateLeads}
              </p>
            </div>

            <div
              style={{
                background: "#ffffff",
                border: "1px solid #dbeafe",
                borderRadius: "14px",
                padding: "18px",
              }}
            >
              <strong>Usuarios PRO</strong>
              <p style={{ margin: "10px 0 0 0", color: "#374151" }}>
                {affiliatePaid}
              </p>
            </div>
          </div>
        </section>
      )}

      <section
        style={{
          background: plan === "pro" ? "#ecfdf5" : "#fff7ed",
          border: plan === "pro" ? "1px solid #86efac" : "1px solid #fdba74",
          borderRadius: "16px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: plan === "pro" ? "#15803d" : "#c2410c",
          }}
        >
          Tu siguiente paso
        </div>

        {plan === "pro" ? (
          <>
            <h2 style={{ margin: 0, fontSize: "28px", color: "#166534" }}>
              Tu acceso PRO está activo
            </h2>

            <p
              style={{
                margin: 0,
                lineHeight: 1.7,
                color: "#166534",
                maxWidth: "820px",
              }}
            >
              Puedes analizar todas tus cartas sin límite y tomar decisiones con
              claridad.
            </p>
          </>
        ) : (
          <>
            <h2 style={{ margin: 0, fontSize: "28px", color: "#111827" }}>
              {isTrialActive
                ? "Tu prueba gratuita está corriendo"
                : "Tu prueba gratuita terminó"}
            </h2>

            <p
              style={{
                margin: 0,
                lineHeight: 1.7,
                color: "#7c2d12",
                maxWidth: "820px",
              }}
            >
              {isTrialActive
                ? `Tienes ${trialDaysRemaining} día${
                    trialDaysRemaining === 1 ? "" : "s"
                  } restantes para usar tus análisis base.`
                : "Ya no tienes análisis base activos. Ahora solo puedes seguir usando SimpleUS con referidos o pasando a PRO."}
            </p>

            <p
              style={{
                margin: 0,
                lineHeight: 1.7,
                color: "#7c2d12",
                maxWidth: "820px",
              }}
            >
              Ya usaste {Math.min(count, realFreeLimit)} de {realFreeLimit} análisis
              disponibles.
            </p>

            {bonusAnalyses > 0 && (
              <div
                style={{
                  fontSize: "14px",
                  color: "#1d4ed8",
                  fontWeight: 700,
                }}
              >
                Tienes +{bonusAnalyses} análisis extra ganados por referidos.
              </div>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                maxWidth: "520px",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "12px",
                  background: "#fed7aa",
                  borderRadius: "999px",
                  overflow: "hidden",
                  border: "1px solid #fdba74",
                }}
              >
                <div
                  style={{
                    width: `${progressPercent}%`,
                    height: "100%",
                    background: "#ea580c",
                    borderRadius: "999px",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>

              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#9a3412",
                }}
              >
                {Math.min(count, realFreeLimit)} / {realFreeLimit} análisis usados
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <button
                type="button"
                onClick={activarPro}
                disabled={cargandoPago}
                style={{
                  background: cargandoPago ? "#93c5fd" : "#1d4ed8",
                  color: "#ffffff",
                  padding: "12px 18px",
                  borderRadius: "10px",
                  border: "none",
                  fontWeight: 700,
                  cursor: cargandoPago ? "not-allowed" : "pointer",
                }}
              >
                {cargandoPago ? "Redirigiendo..." : "Activar PRO ahora"}
              </button>
            </div>

            {mensajePago && (
              <div
                style={{
                  color: "#b91c1c",
                  fontSize: "14px",
                  lineHeight: 1.5,
                }}
              >
                {mensajePago}
              </div>
            )}
          </>
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
        <h2 style={{ fontSize: "26px", margin: 0 }}>
          {isAffiliate ? "Programa de afiliados" : "Invita y gana"}
        </h2>

        <p style={{ color: "#6b7280", lineHeight: 1.7, margin: 0 }}>
          {isAffiliate
            ? "Comparte tu enlace de afiliado en redes sociales y usa tu cuenta PRO para mostrar cómo funciona SimpleUS."
            : "Comparte tu enlace personal con amigos o familiares. Mientras más personas entren con tu invitación, más recompensas podrás desbloquear."}
        </p>

        <div
          style={{
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "14px",
            padding: "18px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              color: "#374151",
              fontWeight: 700,
            }}
          >
            {isAffiliate ? "Tu enlace de afiliado" : "Tu enlace de referido"}
          </div>

          <input
            value={referralLink}
            readOnly
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
              color: "#111827",
              background: "#ffffff",
              boxSizing: "border-box",
            }}
          />

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <button
              type="button"
              onClick={copiarLinkReferido}
              disabled={!referralLink}
              style={{
                background: referralLink ? "#1d4ed8" : "#93c5fd",
                color: "#ffffff",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "none",
                fontWeight: 700,
                cursor: referralLink ? "pointer" : "not-allowed",
              }}
            >
              {copiado ? "¡Copiado!" : "Copiar enlace"}
            </button>

            {!isAffiliate && (
              <span
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                Referidos registrados: <strong>{referralsCount}</strong>
              </span>
            )}
          </div>

          {!isAffiliate && (
            <>
              <div
                style={{
                  background: "#ffffff",
                  border: "1px dashed #d1d5db",
                  borderRadius: "12px",
                  padding: "14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                <strong>Recompensas actuales</strong>
                <span>1 referido = +1 análisis extra</span>
                <span>3 referidos = +3 análisis extra</span>
                <span>5 referidos = +7 análisis extra</span>
                <span>10 referidos = 1 mes PRO gratis</span>
              </div>

              {nextReferralGoal !== null ? (
                <div
                  style={{
                    background: "#eff6ff",
                    border: "1px solid #bfdbfe",
                    borderRadius: "12px",
                    padding: "14px",
                    color: "#1e3a8a",
                    fontSize: "14px",
                    lineHeight: 1.6,
                  }}
                >
                  Te faltan <strong>{referralsRemaining}</strong> referido
                  {referralsRemaining === 1 ? "" : "s"} para alcanzar tu siguiente
                  meta de <strong>{nextReferralGoal}</strong>.
                </div>
              ) : (
                <div
                  style={{
                    background: "#ecfdf5",
                    border: "1px solid #86efac",
                    borderRadius: "12px",
                    padding: "14px",
                    color: "#166534",
                    fontSize: "14px",
                    lineHeight: 1.6,
                  }}
                >
                  Ya alcanzaste el nivel máximo visible de recompensas. El siguiente
                  paso es pasar esto a afiliados y comisiones.
                </div>
              )}
            </>
          )}

          <div
            style={{
              fontSize: "13px",
              color: "#6b7280",
              lineHeight: 1.6,
            }}
          >
            {isAffiliate
              ? "Tu enlace está listo para usarse en TikTok, Instagram, WhatsApp, YouTube o cualquier red social."
              : "Tu invitación ayudará a otras personas a entender cartas importantes en inglés con más claridad."}
          </div>
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
          <h2 style={{ fontSize: "26px", margin: 0 }}>Últimos análisis</h2>

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
            Aún no tienes análisis guardados.
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
                <strong>{item.tipo || "Análisis sin título"}</strong>
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