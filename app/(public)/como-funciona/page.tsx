import Link from "next/link";
import PublicNavbar from "@/components/marketing/public-navbar";
import PublicFooter from "@/components/marketing/public-footer";

export default function ComoFuncionaPage() {
  return (
    <>
      <PublicNavbar />

      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "40px 20px 60px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "40px",
        }}
      >
        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "32px",
          }}
        >
          <div
            style={{
              display: "inline-block",
              fontSize: "13px",
              color: "#1d4ed8",
              fontWeight: 600,
              marginBottom: "12px",
            }}
          >
            Cómo funciona SimpleUS
          </div>

          <h1
            style={{
              fontSize: "40px",
              lineHeight: 1.15,
              margin: "0 0 16px 0",
            }}
          >
            Entiende mejor tus cartas en inglés paso a paso
          </h1>

          <p
            style={{
              color: "#4b5563",
              lineHeight: 1.8,
              fontSize: "17px",
              maxWidth: "780px",
              margin: 0,
            }}
          >
            SimpleUS fue diseñado para ayudarte a entender cartas importantes en
            inglés con una explicación clara en español. Aquí te mostramos cómo
            funciona y qué puedes esperar al usar la plataforma.
          </p>
        </section>

        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "28px",
          }}
        >
          <h2 style={{ fontSize: "28px", marginTop: 0, marginBottom: "14px" }}>
            1. Comparte tu carta con SimpleUS
          </h2>

          <p style={{ color: "#4b5563", lineHeight: 1.8, marginBottom: "18px" }}>
            Puedes usar la forma que te resulte más cómoda:
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
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "14px",
                padding: "20px",
              }}
            >
              <strong>Pegar texto</strong>
              <p style={{ color: "#6b7280", lineHeight: 1.7, marginTop: "10px" }}>
                Si puedes copiar el contenido de la carta, pégalo directamente en
                el analizador.
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
              <strong>Subir una foto</strong>
              <p style={{ color: "#6b7280", lineHeight: 1.7, marginTop: "10px" }}>
                Si tienes la carta en papel, puedes tomarle una foto y subirla.
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
              <strong>Subir un PDF</strong>
              <p style={{ color: "#6b7280", lineHeight: 1.7, marginTop: "10px" }}>
                También puedes compartir un PDF. Esta función sigue en evolución y
                algunos documentos pueden funcionar mejor que otros.
              </p>
            </div>
          </div>
        </section>

        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "28px",
          }}
        >
          <h2 style={{ fontSize: "28px", marginTop: 0, marginBottom: "14px" }}>
            2. SimpleUS analiza el contenido
          </h2>

          <p style={{ color: "#4b5563", lineHeight: 1.8, margin: 0 }}>
            Después de recibir el texto, foto o PDF, SimpleUS analiza el contenido
            para identificar el tipo de carta, el tono del mensaje, posibles fechas
            importantes y el nivel de urgencia.
          </p>
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
          <h2 style={{ fontSize: "28px", margin: 0 }}>
            3. Recibes tu Mapa SimpleUS
          </h2>

          <p style={{ color: "#4b5563", lineHeight: 1.8, margin: 0 }}>
            El resultado se presenta en un formato claro y fácil de entender.
          </p>

          <div
            style={{
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div>
              <strong>Qué es esta carta</strong>
              <p style={{ color: "#6b7280", lineHeight: 1.7, marginTop: "8px" }}>
                SimpleUS identifica el tipo de documento o su posible propósito.
              </p>
            </div>

            <div>
              <strong>Qué significa</strong>
              <p style={{ color: "#6b7280", lineHeight: 1.7, marginTop: "8px" }}>
                Recibes una explicación en español claro sobre el contenido del
                documento.
              </p>
            </div>

            <div>
              <strong>Nivel de urgencia</strong>
              <p style={{ color: "#6b7280", lineHeight: 1.7, marginTop: "8px" }}>
                SimpleUS te ayuda a percibir si conviene actuar pronto o revisar con
                más calma.
              </p>
            </div>

            <div>
              <strong>Qué podrías hacer</strong>
              <p style={{ color: "#6b7280", lineHeight: 1.7, marginTop: "8px" }}>
                Verás pasos sugeridos para orientarte mejor.
              </p>
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
              <p style={{ color: "#1e3a8a", lineHeight: 1.7, marginTop: "8px" }}>
                También recibirás una explicación con un tono más humano, para que
                no te sientas perdido al leer documentos importantes.
              </p>
            </div>
          </div>
        </section>

        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "28px",
          }}
        >
          <h2 style={{ fontSize: "28px", marginTop: 0, marginBottom: "14px" }}>
            4. Guarda tu historial
          </h2>

          <p style={{ color: "#4b5563", lineHeight: 1.8, margin: 0 }}>
            Tu cuenta puede guardar análisis anteriores para que puedas volver a
            revisar cartas ya analizadas, comparar documentos y mantener más orden
            en tu historial.
          </p>
        </section>

        <section
          style={{
            background: "#fff7ed",
            border: "1px solid #fdba74",
            borderRadius: "16px",
            padding: "28px",
          }}
        >
          <h2 style={{ fontSize: "28px", marginTop: 0, marginBottom: "14px" }}>
            Aviso importante
          </h2>

          <p style={{ color: "#9a3412", lineHeight: 1.8, margin: 0 }}>
            SimpleUS ofrece orientación general para ayudarte a entender cartas en
            inglés, pero no sustituye asesoría legal, financiera, migratoria ni
            profesional especializada. Si tu caso es delicado o urgente, conviene
            consultar a un experto.
          </p>
        </section>

        <section
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <h2 style={{ fontSize: "28px", margin: 0 }}>
            Empieza a usar SimpleUS
          </h2>

          <p style={{ color: "#6b7280", lineHeight: 1.7 }}>
            Crea tu cuenta y prueba cómo se siente entender mejor tus cartas en
            inglés.
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
