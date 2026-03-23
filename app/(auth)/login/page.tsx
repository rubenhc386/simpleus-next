"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let active = true;

    async function verificarSesion() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!active) return;

        if (session) {
          router.replace("/dashboard");
          return;
        }

        setCheckingSession(false);
      } catch {
        if (!active) return;
        setCheckingSession(false);
      }
    }

    verificarSesion();

    return () => {
      active = false;
    };
  }, [router]);

  async function continuarConGoogle() {
    setMensaje("");

    const redirectTo =
      typeof window !== "undefined"
        ? window.location.origin + "/dashboard"
        : "https://simpleus.app/dashboard";

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (error) {
      setMensaje(error.message);
    }
  }

  async function iniciarSesion() {
    if (!email.trim()) {
      setMensaje("Escribe tu correo electrónico.");
      return;
    }

    if (!password.trim()) {
      setMensaje("Escribe tu contraseña.");
      return;
    }

    try {
      setCargando(true);
      setMensaje("");

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMensaje(error.message);
        return;
      }

      router.replace("/dashboard");
    } catch {
      setMensaje("Ocurrió un error al iniciar sesión.");
    } finally {
      setCargando(false);
    }
  }

  if (checkingSession) {
    return (
      <div
        style={{
          maxWidth: "480px",
          margin: "0 auto",
          paddingTop: "40px",
          paddingBottom: "40px",
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
          Verificando sesión...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "480px",
        margin: "0 auto",
        paddingTop: "40px",
        paddingBottom: "40px",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
      }}
    >
      <h1 style={{ fontSize: "32px", margin: 0 }}>Iniciar sesión</h1>

      <p style={{ color: "#6b7280", lineHeight: 1.6 }}>
        Entra a tu cuenta para revisar tu historial y seguir usando SimpleUS.
      </p>

      {/* Google */}
      <button
        type="button"
        onClick={continuarConGoogle}
        style={{
          background: "#ffffff",
          color: "#111827",
          padding: "12px 16px",
          borderRadius: "10px",
          border: "1px solid #d1d5db",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Continuar con Google
      </button>

      <div
        style={{
          textAlign: "center",
          color: "#6b7280",
          fontSize: "14px",
        }}
      >
        o
      </div>

      {/* Email */}
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          padding: "12px",
          borderRadius: "10px",
          border: "1px solid #d1d5db",
        }}
      />

      {/* Password */}
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
          }}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{
            background: "#ffffff",
            border: "1px solid #d1d5db",
            borderRadius: "10px",
            padding: "12px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {showPassword ? "Ocultar" : "Ver"}
        </button>
      </div>

      {/* Login button */}
      <button
        type="button"
        onClick={iniciarSesion}
        disabled={cargando}
        style={{
          background: cargando ? "#93c5fd" : "#1d4ed8",
          color: "white",
          padding: "12px 16px",
          borderRadius: "10px",
          border: "none",
          cursor: cargando ? "not-allowed" : "pointer",
          fontWeight: 600,
        }}
      >
        {cargando ? "Entrando..." : "Iniciar sesión"}
      </button>

      {/* 🔥 NUEVO: volver */}
      <button
        type="button"
        onClick={() => router.push("/")}
        style={{
          marginTop: "6px",
          background: "#ffffff",
          color: "#374151",
          padding: "12px 16px",
          borderRadius: "10px",
          border: "1px solid #d1d5db",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Volver al inicio
      </button>

      <p style={{ fontSize: "13px", color: "#6b7280", textAlign: "center" }}>
        Puedes explorar SimpleUS sin iniciar sesión.
      </p>

      {mensaje && (
        <div style={{ color: "#b91c1c", fontSize: "14px" }}>
          {mensaje}
        </div>
      )}
    </div>
  );
}
