"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const restantes = Math.ceil(7 - diffDias);

  return Math.max(restantes, 0);
}

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [ultimos, setUltimos] = useState<AnalysisRow[]>([]);
  const [plan, setPlan] = useState<"free" | "pro" | null>(null);
  const [planType, setPlanType] = useState<string | null>(null);
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
  const [affiliateRevenue, setAffiliateRevenue] = useState(0);

  const isPro = plan === "pro";
  const trialDaysRemaining = calcularDiasRestantes(trialStartedAt);
  const isTrialActive = trialDaysRemaining > 0;
  const bonusRemaining = Math.max(bonusAnalyses - count, 0);

  const affiliateCommission = affiliateRevenue * 0.3;

  const progressPercent = useMemo(() => {
    if (plan === null) return 0;
    if (plan === "pro") return 100;
    if (isTrialActive) return 100;
    if (bonusAnalyses <= 0) return 0;

    const usedBonus = Math.min(count, bonusAnalyses);
    return Math.round((usedBonus / bonusAnalyses) * 100);
  }, [count, plan, isTrialActive, bonusAnalyses]);

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
            setPlan(null);
            setPlanType(null);
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
            setAffiliateRevenue(0);
            setLoading(false);
          }
          return;
        }

        const user = session.user;
        setUserEmail(user.email || "");
await new Promise((res) => setTimeout(res, 1500));
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select(
            "plan, plan_type, referral_code, affiliate_code, is_affiliate, referrals_count, bonus_analyses, trial_started_at"
          )
          .eq("id", user.id)
          .single();

        if (!active) return;

        if (!profileError && profileData?.plan === "pro") {
          setPlan("pro");
          setPlanType(profileData?.plan_type || null);
        } else {
          setPlan("free");
          setPlanType(null);
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

          const { data: salesData, error: salesError } = await supabase
            .from("affiliate_sales")
            .select("amount")
            .eq("affiliate_code", affCode)
            .eq("status", "paid");

          if (salesError) {
            console.error("Error cargando ventas del afiliado:", salesError);
            setAffiliateRevenue(0);
          } else {
            const total = (salesData ?? []).reduce((acc, row) => {
              const amount =
                typeof row.amount === "number"
                  ? row.amount
                  : Number(row.amount || 0);
              return acc + (Number.isFinite(amount) ? amount : 0);
            }, 0);

            setAffiliateRevenue(total);
          }
        } else {
          setAffiliateLeads(0);
          setAffiliatePaid(0);
          setAffiliateRevenue(0);
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
          setPlan(null);
          setPlanType(null);
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
          setAffiliateRevenue(0);
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

  function irAPro() {
    router.push("/pro");
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

            <div
              style={{
                background: "#ffffff",
                border: "1px solid #dbeafe",
                borderRadius: "14px",
                padding: "18px",
              }}
            >
              <strong>Total generado</strong>
              <p style={{ margin: "10px 0 0 0", color: "#374151" }}>
                ${affiliateRevenue.toFixed(2)} USD
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
              <strong>Tu comisión (30%)</strong>
              <p style={{ margin: "10px 0 0 0", color: "#374151" }}>
                ${affiliateCommission.toFixed(2)} USD
              </p>
            </div>
          </div>
        </section>
      )}

      <section
        style={{
          background:
            plan === null
              ? "#f9fafb"
              : plan === "pro"
              ? "#ecfdf5"
              : "#fff7ed",
          border:
            plan === null
              ? "1px solid #e5e7eb"
              : plan === "pro"
              ? "1px solid #86efac"
              : "1px solid #fdba74",
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
            color:
              plan === null
                ? "#6b7280"
                : plan === "pro"
                ? "#15803d"
                : "#c2410c",
          }}
        >
          Tu siguiente paso
        </div>

        {plan === null ? (
          <>
            <h2 style={{ margin: 0, fontSize: "28px", color: "#111827" }}>
              Cargando tu cuenta...
            </h2>

            <p
              style={{
                margin: 0,
                lineHeight: 1.7,
                color: "#6b7280",
                maxWidth: "820px",
              }}
            >
              Estamos verificando tu plan y tus privilegios para mostrarte la
              información correcta.
            </p>
          </>
        ) : plan === "pro" ? (
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

            <div
              style={{
                width: "fit-content",
                background: "#ffffff",
                border: "1px solid #86efac",
                borderRadius: "999px",
                padding: "8px 12px",
                fontSize: "14px",
                fontWeight: 700,
                color: "#166534",
              }}
            >
              Tipo de plan:{" "}
              {planType === "annual"
                ? "Anual"
                : planType === "monthly"
                ? "Mensual"
                : "PRO"}
            </div>
          </>
        ) : (
          <>
            <h2 style={{ margin: 0, fontSize: "28px", color: "#111827" }}>
              {isTrialActive
                ? "Tu prueba gratuita está activa"
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
                ? `Tu prueba gratuita de 7 días sigue activa. Te quedan ${trialDaysRemaining} día${
                    trialDaysRemaining === 1 ? "" : "s"
                  } con análisis ilimitados.`
                : "Tu prueba gratuita de 7 días ya terminó. Ahora puedes seguir usando análisis ganados por referidos o pasar a PRO para continuar sin restricciones."}
            </p>

            {isTrialActive ? (
              <p
                style={{
                  margin: 0,
                  lineHeight: 1.7,
                  color: "#7c2d12",
                  maxWidth: "820px",
                }}
              >
                Durante tu prueba puedes analizar cartas sin límite.
              </p>
            ) : bonusAnalyses > 0 ? (
              <p
                style={{
                  margin: 0,
                  lineHeight: 1.7,
                  color: "#7c2d12",
                  maxWidth: "820px",
                }}
              >
                Tienes <strong>{bonusRemaining}</strong> de{" "}
                <strong>{bonusAnalyses}</strong> análisis extra disponibles por
                referidos.
              </p>
            ) : (
              <p
                style={{
                  margin: 0,
                  lineHeight: 1.7,
                  color: "#7c2d12",
                  maxWidth: "820px",
                }}
              >
                En este momento no tienes análisis extra disponibles.
              </p>
            )}

            {!isTrialActive && bonusAnalyses > 0 && (
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
                {isTrialActive
                  ? "Prueba activa · análisis ilimitados"
                  : bonusAnalyses > 0
                  ? `${Math.max(count, 0)} análisis totales guardados · ${bonusRemaining} análisis extra disponibles`
                  : "Prueba finalizada"}
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
                onClick={irAPro}
                style={{
                  background: "#1d4ed8",
                  color: "#ffffff",
                  padding: "12px 18px",
                  borderRadius: "10px",
                  border: "none",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Ver opciones PRO
              </button>
            </div>
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