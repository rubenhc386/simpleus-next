"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PublicFooter() {
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
    <footer
      style={{
        marginTop: "60px",
        borderTop: "1px solid #e5e7eb",
        background: "#ffffff",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "32px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "28px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "24px",
          }}
        >
          <div>
            <div
              style={{
                fontWeight: 800,
                fontSize: "20px",
                color: "#111827",
                marginBottom: "10px",
              }}
            >
              SimpleUS
            </div>

            <p
              style={{
                color: "#6b7280",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              Herramienta creada para ayudar a hispanohablantes en Estados Unidos
              a entender cartas importantes en inglés con más claridad y menos
              estrés.
            </p>
          </div>

          <div>
            <div
              style={{
                fontWeight: 700,
                marginBottom: "10px",
                color: "#111827",
              }}
            >
              Navegación
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <Link
                href="/"
                style={{
                  color: "#4b5563",
                  textDecoration: "none",
                }}
              >
                Inicio
              </Link>

              <Link
                href="/como-funciona"
                style={{
                  color: "#4b5563",
                  textDecoration: "none",
                }}
              >
                Cómo funciona
              </Link>

              <Link
                href="/precios"
                style={{
                  color: "#4b5563",
                  textDecoration: "none",
                }}
              >
                Precios
              </Link>

              {!loading &&
                (isLoggedIn ? (
                  <>
                    <Link
                      href="/dashboard"
                      style={{
                        color: "#4b5563",
                        textDecoration: "none",
                      }}
                    >
                      Ir al dashboard
                    </Link>

                    <button
                      type="button"
                      onClick={cerrarSesion}
                      style={{
                        background: "transparent",
                        border: "none",
                        padding: 0,
                        margin: 0,
                        textAlign: "left",
                        color: "#4b5563",
                        cursor: "pointer",
                        fontSize: "16px",
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
                        color: "#4b5563",
                        textDecoration: "none",
                      }}
                    >
                      Iniciar sesión
                    </Link>

                    <Link
                      href="/registro"
                      style={{
                        color: "#4b5563",
                        textDecoration: "none",
                      }}
                    >
                      Crear cuenta
                    </Link>
                  </>
                ))}
            </div>
          </div>

          <div>
            <div
              style={{
                fontWeight: 700,
                marginBottom: "10px",
                color: "#111827",
              }}
            >
              Aviso importante
            </div>

            <p
              style={{
                color: "#6b7280",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              SimpleUS ofrece orientación general en español para entender cartas
              administrativas, pero no sustituye asesoría legal, financiera o
              profesional especializada.
            </p>
          </div>

          <div>
            <div
              style={{
                fontWeight: 700,
                marginBottom: "10px",
                color: "#111827",
              }}
            >
              Contacto
            </div>

            <p
              style={{
                color: "#6b7280",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              Proyecto creado por RubenHC.
              <br />
              Próximamente: soporte, ayuda y recursos adicionales.
            </p>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid #e5e7eb",
            paddingTop: "18px",
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          <span>©️ 2026 SimpleUS by RubenHC3_. Todos los derechos reservados.</span>

          <span>Hecho para nuestra comunidad hispana en EE.UU.</span>
        </div>
      </div>
    </footer>
  );
}