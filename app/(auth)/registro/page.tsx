"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RegistroPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function continuarConGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://simpleus.app",
      },
    });

    if (error) {
      setMensaje(error.message);
    }
  }

  async function registrarse() {
    if (!email.trim()) {
      setMensaje("Escribe tu correo electrónico.");
      return;
    }

    if (!password.trim()) {
      setMensaje("Escribe una contraseña.");
      return;
    }

    if (!confirmPassword.trim()) {
      setMensaje("Confirma tu contraseña.");
      return;
    }

    if (password !== confirmPassword) {
      setMensaje("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      setMensaje("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      setCargando(true);
      setMensaje("");

      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMensaje(error.message);
        return;
      }

      setMensaje(
        "Cuenta creada. Revisa tu correo para confirmar tu cuenta. Si no ves el mensaje, revisa la carpeta de spam o promociones."
      );
    } catch {
      setMensaje("Ocurrió un error al crear la cuenta.");
    } finally {
      setCargando(false);
    }
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
      <h1 style={{ fontSize: "32px", margin: 0 }}>Crear cuenta</h1>

      <p style={{ color: "#6b7280", lineHeight: 1.6 }}>
        Crea tu cuenta para guardar tu historial y usar SimpleUS de forma
        personal.
      </p>

      <button
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

      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
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
            color: "#111827",
            padding: "12px 14px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            cursor: "pointer",
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          {showPassword ? "Ocultar" : "Ver"}
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
          }}
        />

        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          style={{
            background: "#ffffff",
            color: "#111827",
            padding: "12px 14px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            cursor: "pointer",
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          {showConfirmPassword ? "Ocultar" : "Ver"}
        </button>
      </div>

      <button
        onClick={registrarse}
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
        {cargando ? "Creando cuenta..." : "Crear cuenta"}
      </button>

      {mensaje && (
        <div style={{ color: "#374151", lineHeight: 1.6 }}>{mensaje}</div>
      )}
    </div>
  );
}
