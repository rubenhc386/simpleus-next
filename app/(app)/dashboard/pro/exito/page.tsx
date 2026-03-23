import Link from "next/link";

export default function ProExitoPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        paddingTop: "40px",
        paddingBottom: "40px",
        maxWidth: "760px",
      }}
    >
      <div
        style={{
          background: "#ecfdf5",
          border: "1px solid #86efac",
          borderRadius: "16px",
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "#15803d",
          }}
        >
          Pago completado
        </div>

        <h1
          style={{
            fontSize: "34px",
            margin: 0,
            color: "#166534",
          }}
        >
          ¡Bienvenido a SimpleUS Pro!
        </h1>

        <p
          style={{
            lineHeight: 1.7,
            margin: 0,
            color: "#166534",
          }}
        >
          Tu pago fue procesado correctamente. Ya puedes seguir usando
          SimpleUS con una experiencia más completa.
        </p>
      </div>

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <h2 style={{ margin: 0 }}>¿Qué sigue ahora?</h2>

        <ul
          style={{
            margin: 0,
            paddingLeft: "20px",
            lineHeight: 1.8,
            color: "#4b5563",
          }}
        >
          <li>Analiza cartas con texto, foto o PDF.</li>
          <li>Revisa tu historial.</li>
          <li>Organiza mejor tus documentos importantes.</li>
        </ul>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/dashboard"
            style={{
              background: "#1d4ed8",
              color: "#ffffff",
              padding: "12px 16px",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Ir al dashboard
          </Link>

          <Link
            href="/dashboard/analizar"
            style={{
              background: "#ffffff",
              color: "#111827",
              padding: "12px 16px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Analizar una carta
          </Link>
        </div>
      </div>
    </div>
  );
}
