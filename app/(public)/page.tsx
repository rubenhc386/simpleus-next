import Link from "next/link";
import PublicNavbar from "@/components/marketing/public-navbar";
import PublicFooter from "@/components/marketing/public-footer";
import SessionBanner from "@/components/ui/session-banner";
import HeroDemo from "@/components/marketing/hero-demo";

export const metadata = {
  title: "SimpleUS — Entiende tus cartas en inglés",
  description:
    "Explicaciones claras en español para cartas del IRS, DMV, hospitales, bancos, seguros y más.",
  openGraph: {
    title: "SimpleUS — Entiende tus cartas en inglés",
    description:
      "Explicaciones claras en español para cartas importantes en inglés.",
    url: "https://www.simpleus.app",
    siteName: "SimpleUS",
    type: "website",
  },
};

export default function Page() {
  return (
    <>
      <PublicNavbar />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "56px",
          paddingTop: "40px",
          paddingBottom: "40px",
          maxWidth: "1000px",
          margin: "0 auto",
          paddingLeft: "20px",
          paddingRight: "20px",
        }}
      >
        <SessionBanner />

        {/* HERO */}
        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "36px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "28px",
            alignItems: "start",
          }}
        >
          <div style={{ maxWidth: "760px" }}>
            <div
              style={{
                display: "inline-block",
                fontSize: "13px",
                color: "#1d4ed8",
                fontWeight: 600,
                marginBottom: "12px",
              }}
            >
              SimpleUS by RubenHC3_
            </div>

            <h1
              style={{
                fontSize: "42px",
                lineHeight: 1.1,
                margin: "0 0 16px 0",
              }}
            >
              Entiende tus cartas en inglés con claridad, calma y en español.
            </h1>

            <p
              style={{
                fontSize: "18px",
                color: "#4b5563",
                lineHeight: 1.7,
                marginBottom: "24px",
              }}
            >
              SimpleUS ayuda a hispanohablantes en Estados Unidos a entender
              cartas importantes del DMV, IRS, seguros, hospitales, bancos,
              multas, immigration, city hall y utilities.
            </p>

            <p
              style={{
                fontSize: "16px",
                color: "#6b7280",
                lineHeight: 1.7,
                marginBottom: "24px",
              }}
            >
              Pega el texto, sube una foto o comparte un PDF y recibe una
              explicación clara sobre qué es el documento, qué significa y qué
              podrías considerar hacer.
            </p>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/registro"
                style={{
                  background: "#1d4ed8",
                  color: "#ffffff",
                  padding: "12px 18px",
                  borderRadius: "10px",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Crear cuenta gratis
              </Link>

              <Link
                href="/login"
                style={{
                  border: "1px solid #d1d5db",
                  padding: "12px 18px",
                  borderRadius: "10px",
                  fontWeight: 600,
                  background: "#ffffff",
                  textDecoration: "none",
                  color: "#111827",
                }}
              >
                Iniciar sesión
              </Link>

              <Link
                href="/como-funciona"
                style={{
                  border: "1px solid #d1d5db",
                  padding: "12px 18px",
                  borderRadius: "10px",
                  fontWeight: 600,
                  background: "#ffffff",
                  textDecoration: "none",
                  color: "#111827",
                }}
              >
                Ver cómo funciona
              </Link>
            </div>
          </div>

          <HeroDemo />
        </section>

        {/* CONFIANZA */}
        <section
          style={{
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: "16px",
            padding: "28px",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          <h2 style={{ fontSize: "28px", margin: 0 }}>
            Pensado para nuestra comunidad hispana en EE.UU.
          </h2>

          <p style={{ color: "#1e3a8a", lineHeight: 1.8, margin: 0 }}>
            SimpleUS no nació como una idea genérica. Fue creado para ayudar a
            personas reales que reciben cartas en inglés y necesitan claridad sin
            sentirse perdidas o abrumadas.
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
              <strong>Creado con empatía</strong>
              <p style={{ color: "#4b5563", lineHeight: 1.7, marginTop: "8px" }}>
                Pensado para personas que viven en EE.UU. y quieren entender mejor
                documentos importantes en inglés.
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
              <strong>Explicaciones claras</strong>
              <p style={{ color: "#4b5563", lineHeight: 1.7, marginTop: "8px" }}>
                El enfoque de SimpleUS es explicar con palabras simples, humanas y
                fáciles de comprender.
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
              <strong>Construido por RubenHC3_</strong>
              <p style={{ color: "#4b5563", lineHeight: 1.7, marginTop: "8px" }}>
                Detrás del proyecto hay una visión real de ayudar a la comunidad
                hispana con tecnología útil y cercana.
              </p>
            </div>
          </div>
        </section>

        {/* PROBLEMA */}
        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "28px",
          }}
        >
          <h2 style={{ fontSize: "28px", marginBottom: "16px" }}>
            Muchas cartas importantes generan estrés porque no siempre se entienden
          </h2>

          <p
            style={{
              color: "#4b5563",
              lineHeight: 1.8,
              marginBottom: "14px",
            }}
          >
            Recibir una carta en inglés puede provocar ansiedad, especialmente si
            viene de una institución importante o parece urgente. Muchas personas
            no saben si es algo serio, si deben responder rápido o si pueden
            esperar.
          </p>

          <p
            style={{
              color: "#4b5563",
              lineHeight: 1.8,
            }}
          >
            SimpleUS fue creado para darte claridad en esos momentos: entender el
            documento, ubicar el nivel de urgencia y tener una guía inicial en
            español claro.
          </p>
        </section>

        {/* TIPOS DE CARTAS */}
        <section>
          <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>
            Tipos de cartas que SimpleUS puede ayudarte a entender
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "16px",
            }}
          >
            {[
              "DMV",
              "IRS",
              "Seguros",
              "Hospitales",
              "Bancos",
              "Immigration",
              "Utilities",
              "Multas",
            ].map((item) => (
              <div
                key={item}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "14px",
                  padding: "18px",
                  fontWeight: 600,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section>
          <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>
            Cómo funciona
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
            }}
          >
            <div
              style={{
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "14px",
                padding: "20px",
              }}
            >
              <strong>1. Pega texto, sube foto o PDF</strong>
              <p style={{ color: "#6b7280", marginTop: "10px", lineHeight: 1.7 }}>
                Elige la forma más fácil para compartir tu carta con SimpleUS.
              </p>
            </div>

            <div
              style={{
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "14px",
                padding: "20px",
              }}
            >
              <strong>2. Recibe una explicación en español claro</strong>
              <p style={{ color: "#6b7280", marginTop: "10px", lineHeight: 1.7 }}>
                Te ayudamos a entender qué significa el documento de manera simple.
              </p>
            </div>

            <div
              style={{
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "14px",
                padding: "20px",
              }}
            >
              <strong>3. Entiende mejor qué hacer después</strong>
              <p style={{ color: "#6b7280", marginTop: "10px", lineHeight: 1.7 }}>
                Obtén una guía clara y calmada para no sentirte perdido.
              </p>
            </div>
          </div>
        </section>

        {/* FREE VS PRO */}
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
          <div>
            <h2 style={{ fontSize: "28px", margin: "0 0 10px 0" }}>
              Compara el plan gratuito y SimpleUS Pro
            </h2>

            <p style={{ color: "#6b7280", lineHeight: 1.7, margin: 0 }}>
              Empieza gratis y mejora tu experiencia cuando quieras más análisis
              y más herramientas.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "16px",
            }}
          >
            <div
              style={{
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "14px",
                padding: "22px",
              }}
            >
              <div
                style={{
                  fontWeight: 800,
                  fontSize: "20px",
                  marginBottom: "8px",
                }}
              >
                Plan gratuito
              </div>

              <p
                style={{
                  color: "#6b7280",
                  lineHeight: 1.7,
                  marginTop: 0,
                }}
              >
                Ideal para probar SimpleUS y entender tus primeras cartas.
              </p>

              <ul
                style={{
                  lineHeight: 1.9,
                  color: "#4b5563",
                  paddingLeft: "20px",
                  marginBottom: 0,
                }}
              >
                <li>3 análisis incluidos</li>
                <li>Subir texto</li>
                <li>Historial básico</li>
                <li>Acceso inicial al producto</li>
              </ul>
            </div>

            <div
              style={{
                background: "#eff6ff",
                border: "2px solid #1d4ed8",
                borderRadius: "14px",
                padding: "22px",
              }}
            >
              <div
                style={{
                  fontWeight: 800,
                  fontSize: "20px",
                  marginBottom: "8px",
                  color: "#1d4ed8",
                }}
              >
                SimpleUS Pro
              </div>

              <p
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  margin: "0 0 6px 0",
                  color: "#111827",
                }}
              >
                $8.99 / mes
              </p>

              <p
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  margin: "0 0 12px 0",
                  color: "#166534",
                }}
              >
                o $89.90 / año
              </p>

              <ul
                style={{
                  lineHeight: 1.9,
                  color: "#1e3a8a",
                  paddingLeft: "20px",
                  marginBottom: "18px",
                }}
              >
                <li>Análisis ilimitados</li>
                <li>Subir fotos de cartas</li>
                <li>PDF en evolución</li>
                <li>Historial completo</li>
                <li>Más claridad para tu vida diaria</li>
              </ul>

              <Link
                href="/registro"
                style={{
                  display: "inline-block",
                  background: "#1d4ed8",
                  color: "white",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                Empezar con SimpleUS
              </Link>
            </div>
          </div>
        </section>

        {/* BENEFICIOS */}
        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "28px",
          }}
        >
          <h2 style={{ fontSize: "28px", marginBottom: "16px" }}>
            Qué obtienes con SimpleUS
          </h2>

          <ul
            style={{
              lineHeight: 1.9,
              color: "#4b5563",
              paddingLeft: "20px",
              margin: 0,
            }}
          >
            <li>Explicaciones claras en español</li>
            <li>Identificación del nivel de urgencia</li>
            <li>Pasos que podrías considerar</li>
            <li>Historial de cartas analizadas</li>
            <li>Menos estrés cuando recibes documentos en inglés</li>
          </ul>
        </section>

        {/* FAQ */}
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
          <h2 style={{ fontSize: "28px", margin: 0 }}>
            Preguntas frecuentes
          </h2>

          <div>
            <strong>¿SimpleUS reemplaza a un abogado o a un experto?</strong>
            <p style={{ color: "#6b7280", lineHeight: 1.7, marginTop: "8px" }}>
              No. SimpleUS te ayuda a entender cartas en español claro y te da
              orientación general, pero no sustituye asesoría legal, financiera
              o profesional especializada.
            </p>
          </div>

          <div>
            <strong>¿Qué tipo de cartas puedo analizar?</strong>
            <p style={{ color: "#6b7280", lineHeight: 1.7, marginTop: "8px" }}>
              Puedes usar SimpleUS para cartas del DMV, IRS, hospitales,
              seguros, bancos, multas, immigration, utilities y otros documentos
              administrativos en inglés.
            </p>
          </div>

          <div>
            <strong>¿Puedo subir una foto del documento?</strong>
            <p style={{ color: "#6b7280", lineHeight: 1.7, marginTop: "8px" }}>
              Sí. Puedes pegar texto o subir una foto. La opción de PDF está en
              fase beta mientras seguimos mejorándola.
            </p>
          </div>

          <div>
            <strong>¿Necesito pagar para empezar?</strong>
            <p style={{ color: "#6b7280", lineHeight: 1.7, marginTop: "8px" }}>
              No. Puedes comenzar con el plan gratuito y usar tus análisis
              iniciales antes de decidir si quieres pasar a SimpleUS Pro.
            </p>
          </div>

          <div>
            <strong>¿Mi información queda guardada?</strong>
            <p style={{ color: "#6b7280", lineHeight: 1.7, marginTop: "8px" }}>
              Tu cuenta guarda historial para ayudarte a revisar tus análisis
              anteriores. Más adelante seguiremos fortaleciendo seguridad,
              privacidad y controles del producto.
            </p>
          </div>
        </section>

        {/* CREADOR */}
        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "28px",
          }}
        >
          <h2 style={{ fontSize: "28px", marginBottom: "14px" }}>
            Creado por RubenHC3_
          </h2>

          <p
            style={{
              color: "#4b5563",
              lineHeight: 1.8,
              maxWidth: "800px",
            }}
          >
            SimpleUS nace con una misión simple: ayudar a nuestra comunidad hispana
            en Estados Unidos a entender cartas importantes sin sentirse perdida.
            Detrás del proyecto está RubenHC3_, ingeniero mexicano en sistemas y
            creador que quiere construir herramientas claras, humanas y útiles para
            la vida diaria.
          </p>
        </section>

        {/* CTA FINAL */}
        <section
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <h2 style={{ fontSize: "28px", margin: 0 }}>
            Empieza hoy con SimpleUS
          </h2>

          <p style={{ color: "#6b7280", lineHeight: 1.7 }}>
            Entiende tus cartas en inglés con más claridad, menos estrés y una
            guía inicial en español.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/registro"
              style={{
                background: "#1d4ed8",
                color: "white",
                padding: "14px 20px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Crear cuenta gratis
            </Link>

            <Link
              href="/login"
              style={{
                border: "1px solid #d1d5db",
                padding: "14px 20px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: 600,
                color: "#111827",
                background: "#ffffff",
              }}
            >
              Iniciar sesión
            </Link>
          </div>
        </section>
      </div>

      <PublicFooter />
    </>
  );
}