import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid #e5e7eb",
        background: "#ffffff",
        marginTop: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "24px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <div>
          <strong>SimpleUS by RubenHC</strong>
          <div
            style={{
              color: "#6b7280",
              marginTop: "6px",
              fontSize: "14px",
            }}
          >
            Entiende cartas importantes en inglés con claridad, calma y en español.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            fontSize: "14px",
          }}
        >
          <Link href="/">Inicio</Link>
          <Link href="/como-funciona">Cómo funciona</Link>
          <Link href="/precios">Precios</Link>
          <Link href="/registro">Crear cuenta</Link>
        </div>

        <div
          style={{
            color: "#6b7280",
            fontSize: "13px",
          }}
        >
          SimpleUS ofrece información general y no reemplaza asesoría legal.
        </div>
      </div>
    </footer>
  );
}
