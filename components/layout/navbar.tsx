"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let active = true;

    async function cargarSesion() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!active) return;

        setIsAuthenticated(!!user);
      } catch {
        if (!active) return;
        setIsAuthenticated(false);
      } finally {
        if (active) {
          setCheckingSession(false);
        }
      }
    }

    cargarSesion();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setCheckingSession(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function cerrarSesion() {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    router.replace("/login");
    router.refresh();
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
          href={isAuthenticated ? "/dashboard" : "/"}
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
          {isAuthenticated ? (
            <>
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

              {!checkingSession && (
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
              )}
            </>
          ) : (
            <>
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
                  background: "#1d4ed8",
                  color: "#ffffff",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Iniciar sesión
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
