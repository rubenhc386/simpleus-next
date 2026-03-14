"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const router = useRouter();

  async function cerrarSesion() {
    await supabase.auth.signOut();
    router.push("/login");
  }

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
          href="/dashboard"
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
            href="/dashboard"
            style={{
              color: "#4b5563",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Dashboard
          </Link>

          <Link
            href="/dashboard/analizar"
            style={{
              color: "#4b5563",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Analizar
          </Link>

          <Link
            href="/dashboard/foto"
            style={{
              color: "#4b5563",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Foto
          </Link>

          <Link
            href="/dashboard/pdf"
            style={{
              color: "#4b5563",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            PDF
          </Link>

          <Link
            href="/dashboard/historial"
            style={{
              color: "#4b5563",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Historial
          </Link>

          <button
            onClick={cerrarSesion}
            style={{
              background: "#ffffff",
              color: "#111827",
              border: "1px solid #d1d5db",
              padding: "10px 14px",
              borderRadius: "10px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cerrar sesión
          </button>
        </nav>
      </div>
    </header>
  );
}
