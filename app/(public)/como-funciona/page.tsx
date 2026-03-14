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
          Cómo funciona SimpleUS
        </h1>

        <p
          style={{
            fontSize: "18px",
            color: "#4b5563",
            maxWidth: "720px",
            lineHeight: 1.7,
          }}
        >
          SimpleUS te ayuda a entender cartas importantes en inglés de forma
          clara y tranquila en español. No necesitas dominar el inglés ni
          sentirte perdido cuando llega una carta complicada.
        </p>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <h3>1. Comparte tu carta</h3>
          <p style={{ color: "#6b7280", marginTop: "10px" }}>
            Puedes pegar el texto de la carta, subir una foto o subir un PDF del
            documento que recibiste.
          </p>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <h3>2. Recibe una explicación clara</h3>
          <p style={{ color: "#6b7280", marginTop: "10px" }}>
            SimpleUS analiza el documento y te explica en español qué significa
            y qué partes son importantes.
          </p>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <h3>3. Entiende qué hacer</h3>
          <p style={{ color: "#6b7280", marginTop: "10px" }}>
            Recibe orientación clara para saber qué pasos podrías considerar
            después de leer tu carta.
          </p>
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
        <h2 style={{ marginBottom: "10px" }}>Importante</h2>

        <p style={{ color: "#6b7280", lineHeight: 1.7 }}>
          SimpleUS ofrece explicaciones informativas para ayudarte a comprender
          documentos. No reemplaza asesoría legal o profesional.
        </p>
      </section>

      <section>
        <Link
          href="/registro"
          style={{
            background: "#1d4ed8",
            color: "#ffffff",
            padding: "14px 20px",
            borderRadius: "10px",
            fontWeight: 600,
          }}
        >
          Crear cuenta y probar SimpleUS
        </Link>
      </section>
    </div>
  );
}
