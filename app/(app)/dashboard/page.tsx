import Link from "next/link";

export default function Page() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        paddingTop: "40px",
        paddingBottom: "40px",
      }}
    >
      <div>
        <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
          Dashboard de SimpleUS
        </h1>
        <p style={{ color: "#6b7280", lineHeight: 1.6 }}>
          Desde aquí puedes analizar nuevas cartas y revisar tu historial.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "16px",
        }}
      >
        <Link
          href="/dashboard/analizar"
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "24px",
            display: "block",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Analizar carta</h2>
          <p style={{ color: "#6b7280" }}>
            Pega el texto de una carta y genera un Mapa SimpleUS.
          </p>
        </Link>

        <Link
          href="/dashboard/historial"
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "24px",
            display: "block",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Historial</h2>
          <p style={{ color: "#6b7280" }}>
            Revisa los análisis guardados anteriormente.
          </p>
        </Link>
      </div>
    </div>
  );
}
