import Link from "next/link";

export default function Page() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "40px",
        paddingTop: "40px",
        paddingBottom: "40px",
      }}
    >
      <section>
        <h1 style={{ fontSize: "36px", marginBottom: "16px" }}>
          Precios simples para entender tus cartas
        </h1>

        <p
          style={{
            fontSize: "18px",
            color: "#4b5563",
            maxWidth: "720px",
            lineHeight: 1.7,
          }}
        >
          SimpleUS está diseñado para ayudarte a entender documentos importantes
          en inglés sin estrés. Empieza gratis y actualiza solo si lo necesitas.
        </p>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "24px",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "28px",
          }}
        >
          <h2>Free</h2>

          <p style={{ color: "#6b7280" }}>
            Para probar SimpleUS y entender cartas ocasionales.
          </p>

          <div
            style={{
              fontSize: "32px",
              fontWeight: "700",
              marginTop: "16px",
              marginBottom: "16px",
            }}
          >
            $0
          </div>

          <ul style={{ color: "#6b7280", lineHeight: 1.8 }}>
            <li>Analizar texto de cartas</li>
            <li>Explicación en español</li>
            <li>Uso limitado mensual</li>
          </ul>

          <div style={{ marginTop: "20px" }}>
            <Link
              href="/registro"
              style={{
                border: "1px solid #d1d5db",
                padding: "10px 14px",
                borderRadius: "8px",
              }}
            >
              Empezar gratis
            </Link>
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "2px solid #1d4ed8",
            borderRadius: "16px",
            padding: "28px",
          }}
        >
          <h2>Pro</h2>

          <p style={{ color: "#6b7280" }}>
            Para personas que reciben cartas con frecuencia.
          </p>

          <div
            style={{
              fontSize: "32px",
              fontWeight: "700",
              marginTop: "16px",
              marginBottom: "16px",
            }}
          >
            $8.99 / mes
          </div>

          <ul style={{ color: "#6b7280", lineHeight: 1.8 }}>
            <li>Analizar texto de cartas</li>
            <li>Subir foto de documentos</li>
            <li>Subir PDF</li>
            <li>Historial de cartas</li>
            <li>Uso ampliado</li>
          </ul>

          <div style={{ marginTop: "20px" }}>
            <Link
              href="/registro"
              style={{
                background: "#1d4ed8",
                color: "#ffffff",
                padding: "10px 14px",
                borderRadius: "8px",
                fontWeight: "600",
              }}
            >
              Elegir Pro
            </Link>
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "28px",
          }}
        >
          <h2>Familiar</h2>

          <p style={{ color: "#6b7280" }}>
            Ideal para familias que ayudan a padres o familiares.
          </p>

          <div
            style={{
              fontSize: "32px",
              fontWeight: "700",
              marginTop: "16px",
              marginBottom: "16px",
            }}
          >
            Próximamente
          </div>

          <ul style={{ color: "#6b7280", lineHeight: 1.8 }}>
            <li>Varias cuentas familiares</li>
            <li>Historial compartido</li>
            <li>Mayor capacidad de uso</li>
          </ul>

          <div style={{ marginTop: "20px", color: "#6b7280" }}>
            Disponible más adelante
          </div>
        </div>
      </section>
    </div>
  );
}
