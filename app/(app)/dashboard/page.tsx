import Link from "next/link";

export default function DashboardPage() {
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
            Gratis
          </p>
          <p style={{ color: "#6b7280", lineHeight: 1.7, margin: 0 }}>
            Empieza con tus análisis iniciales y luego decide si quieres pasar a
            SimpleUS Pro.
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
          <strong style={{ fontSize: "18px" }}>Uso estimado</strong>
          <p style={{ color: "#4b5563", lineHeight: 1.7, marginTop: "10px" }}>
            0 de 3 análisis usados
          </p>
          <p style={{ color: "#6b7280", lineHeight: 1.7, margin: 0 }}>
            Este dato puede mejorar más adelante cuando conectemos mejor el conteo
            real del plan gratuito.
          </p>
        </div>

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
            Desbloquea más análisis y una experiencia más completa.
          </p>

          <Link
            href="/precios"
            style={{
              display: "inline-block",
              background: "#1d4ed8",
              color: "#ffffff",
              padding: "10px 14px",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Ver precios
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
        <h2 style={{ fontSize: "26px", margin: 0 }}>Accesos rápidos</h2>

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
              Sube un PDF con texto. Esta función sigue en evolución.
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
              Revisa tus análisis anteriores desde una sola pantalla.
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
          gap: "14px",
        }}
      >
        <h2 style={{ fontSize: "26px", margin: 0 }}>
          Qué puedes hacer hoy con SimpleUS
        </h2>

        <ul
          style={{
            color: "#4b5563",
            lineHeight: 1.9,
            paddingLeft: "20px",
            margin: 0,
          }}
        >
          <li>Entender cartas importantes en inglés con más claridad</li>
          <li>Ubicar mejor el nivel de urgencia</li>
          <li>Recibir pasos sugeridos en español</li>
          <li>Guardar análisis en tu historial</li>
          <li>Usar texto, foto y PDF según el caso</li>
        </ul>
      </section>
    </div>
  );
}
