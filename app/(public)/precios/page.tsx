import Link from "next/link";
import PublicNavbar from "@/components/marketing/public-navbar";
import PublicFooter from "@/components/marketing/public-footer";

export default function PreciosPage() {
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
            textAlign: "center",
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
            Precios de SimpleUS
          </div>

          <h1
            style={{
              fontSize: "40px",
              lineHeight: 1.15,
              margin: "0 0 16px 0",
            }}
          >
            Empieza gratis y mejora cuando necesites más
          </h1>

          <p
            style={{
              color: "#4b5563",
              lineHeight: 1.8,
              fontSize: "17px",
              maxWidth: "760px",
              margin: "0 auto",
            }}
          >
            SimpleUS está diseñado para que puedas probar la plataforma y luego
            avanzar a un plan más completo si necesitas analizar más cartas y
            guardar más historial.
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {/* FREE */}
          <div
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
            <div>
              <h2 style={{ margin: 0, fontSize: "28px" }}>Gratis</h2>
              <p
                style={{
                  fontSize: "30px",
                  fontWeight: 800,
                  margin: "10px 0 0 0",
                }}
              >
                $0
              </p>
            </div>

            <p style={{ color: "#6b7280", lineHeight: 1.7, margin: 0 }}>
              Ideal para probar SimpleUS y entender tus primeras cartas.
            </p>

            <ul
              style={{
                color: "#4b5563",
                lineHeight: 1.9,
                paddingLeft: "20px",
                margin: 0,
              }}
            >
              <li>3 análisis incluidos</li>
              <li>Subir texto</li>
              <li>Historial básico</li>
              <li>Acceso inicial al producto</li>
            </ul>

            <Link
              href="/registro"
              style={{
                marginTop: "8px",
                display: "inline-block",
                textAlign: "center",
                background: "#ffffff",
                color: "#111827",
                border: "1px solid #d1d5db",
                padding: "12px 16px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Empezar gratis
            </Link>
          </div>

          {/* PRO */}
          <div
            style={{
              background: "#eff6ff",
              border: "2px solid #1d4ed8",
              borderRadius: "16px",
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <div
              style={{
                display: "inline-block",
                width: "fit-content",
                background: "#dbeafe",
                color: "#1d4ed8",
                borderRadius: "999px",
                padding: "6px 10px",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              Recomendado
            </div>

            <div>
              <h2 style={{ margin: 0, fontSize: "28px", color: "#1d4ed8" }}>
                SimpleUS Pro
              </h2>
              <p
                style={{
                  fontSize: "30px",
                  fontWeight: 800,
                  margin: "10px 0 0 0",
                  color: "#111827",
                }}
              >
                $8.99 / mes
              </p>
            </div>

            <p style={{ color: "#1e3a8a", lineHeight: 1.7, margin: 0 }}>
              Para quienes necesitan usar SimpleUS con más frecuencia y guardar
              mejor su historial.
            </p>

            <ul
              style={{
                color: "#1e3a8a",
                lineHeight: 1.9,
                paddingLeft: "20px",
                margin: 0,
              }}
            >
              <li>Análisis ilimitados</li>
              <li>Subir fotos de cartas</li>
              <li>PDF en evolución</li>
              <li>Historial completo</li>
              <li>Más claridad y continuidad en tu cuenta</li>
            </ul>

            <Link
              href="/registro"
              style={{
                marginTop: "8px",
                display: "inline-block",
                textAlign: "center",
                background: "#1d4ed8",
                color: "#ffffff",
                padding: "12px 16px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Crear cuenta
            </Link>
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
            ¿Qué plan me conviene?
          </h2>

          <p style={{ color: "#4b5563", lineHeight: 1.8, marginBottom: "14px" }}>
            Si solo quieres probar cómo funciona SimpleUS y entender algunas
            cartas, el plan gratuito es una excelente forma de empezar.
          </p>

          <p style={{ color: "#4b5563", lineHeight: 1.8, margin: 0 }}>
            Si necesitas analizar más cartas, guardar mejor tu historial y usar
            la plataforma con más constancia, entonces SimpleUS Pro será la mejor
            opción.
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
            profesional especializada.
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
            Empieza hoy con SimpleUS
          </h2>

          <p style={{ color: "#6b7280", lineHeight: 1.7 }}>
            Prueba la versión gratuita y descubre si SimpleUS puede ayudarte a
            entender mejor tus cartas en inglés.
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
