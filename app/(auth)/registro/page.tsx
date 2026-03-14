"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RegistroPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  async function registrarse() {
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

      setMensaje("Cuenta creada. Revisa tu correo si Supabase pide confirmación.");
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
        Crea tu cuenta para guardar tu historial y usar SimpleUS de forma personal.
      </p>

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

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          padding: "12px",
          borderRadius: "10px",
          border: "1px solid #d1d5db",
        }}
      />

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
