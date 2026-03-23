import Link from "next/link";

export default function PublicNavbar() {
  return (
    <header
      style={{
        width: "100%",
        borderBottom: "1px solid #e5e7eb",
        background: "#ffffff",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/"
          style={{
            fontWeight: 800,
            fontSize: "20px",
            color: "#111827",
            textDecoration: "none",
          }}
        >
          SimpleUS
        </Link>

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/"
            style={{
              color: "#4b5563",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Inicio
          </Link>

          <Link
            href="/como-funciona"
            style={{
              color: "#4b5563",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Cómo funciona
          </Link>

          <Link
            href="/precios"
            style={{
              color: "#4b5563",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Precios
          </Link>

          <Link
            href="/login"
            style={{
              color: "#111827",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Iniciar sesión
          </Link>

          <Link
            href="/registro"
            style={{
              background: "#1d4ed8",
              color: "#ffffff",
              textDecoration: "none",
              padding: "10px 14px",
              borderRadius: "10px",
              fontWeight: 600,
            }}
          >
            Crear cuenta
          </Link>
        </nav>
      </div>
    </header>
  );
}