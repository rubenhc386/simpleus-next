import Link from "next/link";
import PublicNavbar from "@/components/marketing/public-navbar";
import PublicFooter from "@/components/marketing/public-footer";

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
        {/* HERO */}
        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "36px",
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
              SimpleUS by RubenHC
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
              <strong>Construido por RubenHC</strong>
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

        {/* DEMO VISUAL */}
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
              Así se ve un Mapa SimpleUS
            </h2>

            <p style={{ color: "#6b7280", lineHeight: 1.7, margin: 0 }}>
              Después de analizar una carta, SimpleUS te muestra una explicación
              clara en español para ayudarte a entenderla mejor.
            </p>
          </div>

          <div
            style={{
              background: "#f9fafb",
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
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <h3 style={{ margin: 0 }}>Mapa SimpleUS</h3>

              <span
                style={{
                  background: "#fef3c7",
                  color: "#92400e",
                  padding: "8px 12px",
                  borderRadius: "999px",
                  fontWeight: 700,
                  fontSize: "13px",
                }}
              >
                Urgencia media
              </span>
            </div>

            <div>
              <strong>Qué es esta carta</strong>
              <p style={{ marginTop: "8px", color: "#4b5563", lineHeight: 1.7 }}>
                Posible aviso administrativo sobre una fecha límite o una acción
                pendiente.
              </p>
            </div>

            <div>
              <strong>Qué significa</strong>
              <p style={{ marginTop: "8px", color: "#4b5563", lineHeight: 1.7 }}>
                La carta parece informar sobre un trámite o una notificación que
                conviene revisar con atención para no pasar por alto una fecha
                importante.
              </p>
            </div>

            <div>
              <strong>Qué podrías hacer</strong>
              <ul style={{ marginTop: "8px", color: "#4b5563", lineHeight: 1.8 }}>
                <li>Leer cuidadosamente el documento completo</li>
                <li>Identificar fechas y montos importantes</li>
                <li>Guardar una copia del aviso</li>
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
              <p style={{ marginTop: "10px", color: "#1e3a8a", lineHeight: 1.7 }}>
                Respira. Muchas cartas son informativas o tienen solución. Lo más
                importante es entender qué dicen y revisar si hay alguna acción
                que debas tomar.
              </p>
            </div>
          </div>
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

        {/* PRECIO */}
        <section
          style={{
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "32px",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "28px", marginBottom: "12px" }}>
            SimpleUS Pro
          </h2>

          <p
            style={{
              fontSize: "30px",
              fontWeight: 700,
              margin: "0 0 12px 0",
            }}
          >
            $8.99 / mes
          </p>

          <p
            style={{
              color: "#6b7280",
              lineHeight: 1.7,
              maxWidth: "700px",
              margin: "0 auto 20px auto",
            }}
          >
            Analiza todas las cartas que necesites, guarda tu historial y usa
            herramientas pensadas para darte más claridad en tu vida diaria en
            Estados Unidos.
          </p>

          <Link
            href="/registro"
            style={{
              display: "inline-block",
              background: "#1d4ed8",
              color: "white",
              padding: "14px 20px",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Crear cuenta
          </Link>
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
            Creado por RubenHC
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
            Detrás del proyecto está RubenHC, ingeniero mexicano en sistemas y
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
