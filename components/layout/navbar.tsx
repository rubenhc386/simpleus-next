import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      style={{
        borderBottom: "1px solid #e5e7eb",
        background: "#ffffff",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            flexDirection: "column",
            fontWeight: 700,
          }}
        >
          <span>SimpleUS</span>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: "#6b7280",
            }}
          >
            by RubenHC
          </span>
        </Link>

        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            alignItems: "center",
            fontSize: "14px",
          }}
        >
          <Link href="/">Inicio</Link>
          <Link href="/como-funciona">Cómo funciona</Link>
          <Link href="/precios">Precios</Link>
          <Link href="/sobre-rubenhc">Sobre RubenHC</Link>
          <Link href="/login">Login</Link>
          <Link href="/registro">Registro</Link>
        </div>
      </div>
    </nav>
  );
}
