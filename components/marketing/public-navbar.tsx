"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PublicNavbar() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!active) return;

      setIsLoggedIn(!!session?.user);
      setLoading(false);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      if (!active) return;
      setIsLoggedIn(!!session?.user);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function cerrarSesion() {
    await supabase.auth.signOut();
    window.location.href = "/";
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

          {loading ? null : isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                style={{
                  color: "#111827",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Ir al dashboard
              </Link>

              <button
                type="button"
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
            </>
          ) : (
            <>
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
            </>
          )}
        </nav>
      </div>
    </header>
  );
}