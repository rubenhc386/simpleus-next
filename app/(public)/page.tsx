import Link from "next/link";

export default function Page() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "48px",
        paddingTop: "40px",
        paddingBottom: "40px",
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
        <div style={{ maxWidth: "720px" }}>
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
              fontSize: "40px",
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
              lineHeight: 1.6,
              marginBottom: "24px",
            }}
          >
            SimpleUS ayuda a hispanohablantes en Estados Unidos a entender cartas
            importantes de DMV, IRS, seguros, hospitales, bancos, multas,
            immigration, city hall y utilities.
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
              }}
            >
              Comenzar
            </Link>

            <Link
              href="/como-funciona"
              style={{
                border: "1px solid #d1d5db",
                padding: "12px 18px",
                borderRadius: "10px",
                fontWeight: 600,
                background: "#ffffff",
              }}
            >
              Ver cómo funciona
            </Link>
          </div>
        </div>
      </section>

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
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              padding: "20px",
            }}
          >
            <strong>1. Pega texto, sube foto o PDF</strong>
            <p style={{ color: "#6b7280", marginTop: "10px" }}>
              Elige la forma más fácil para compartir tu carta con SimpleUS.
            </p>
          </div>

          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              padding: "20px",
            }}
          >
            <strong>2. Recibe una explicación en español claro</strong>
            <p style={{ color: "#6b7280", marginTop: "10px" }}>
              Te ayudamos a entender qué significa el documento de manera simple.
            </p>
          </div>

          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              padding: "20px",
            }}
          >
            <strong>3. Entiende mejor qué hacer después</strong>
            <p style={{ color: "#6b7280", marginTop: "10px" }}>
              Obtén una guía clara y calmada para no sentirte perdido.
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
        <h2 style={{ fontSize: "28px", marginBottom: "14px" }}>
          Creado por RubenHC
        </h2>

        <p
          style={{
            color: "#4b5563",
            lineHeight: 1.7,
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
    </div>
  );
}
