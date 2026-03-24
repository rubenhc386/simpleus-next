"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

function generarCodigo() {
  return Math.random().toString(36).substring(2, 8);
}

export default function RegistroPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [registroExitoso, setRegistroExitoso] = useState(false);

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
        : "http://localhost:3000/dashboard";

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
      setRegistroExitoso(false);

      const referralCode = localStorage.getItem("referral_code");

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMensaje(error.message);
        return;
      }

      const userId = data.user?.id;

      if (!userId) {
        setMensaje("No se pudo obtener el usuario recién creado.");
        return;
      }

      let referredById: string | null = null;

      if (referralCode) {
        const { data: referralOwner, error: referralError } = await supabase
          .from("profiles")
          .select("id")
          .eq("referral_code", referralCode)
          .maybeSingle();

        if (
          !referralError &&
          referralOwner?.id &&
          referralOwner.id !== userId
        ) {
          referredById = referralOwner.id;
        }
      }

      let nuevoCodigo = generarCodigo();

      const { data: codigoExistente } = await supabase
        .from("profiles")
        .select("id")
        .eq("referral_code", nuevoCodigo)
        .maybeSingle();

      if (codigoExistente?.id) {
        nuevoCodigo =
          generarCodigo() + Math.floor(Math.random() * 10).toString();
      }

      const { error: profileError } = await supabase.from("profiles").upsert({
        id: userId,
        plan: "free",
        referral_code: nuevoCodigo,
        referred_by: referredById,
      });

      if (profileError) {
        setMensaje("La cuenta se creó, pero no se pudo completar el perfil.");
        return;
      }

      if (referredById) {
  const { error: referralIncrementError } = await supabase.rpc(
    "increment_referrals",
    {
      user_id_input: referredById,
    }
  );

  if (referralIncrementError) {
    console.error(
      "No se pudo incrementar referrals_count:",
      referralIncrementError
    );
  }

  const { error: inviterBonusError } = await supabase.rpc(
    "add_bonus_analysis",
    {
      user_id_input: referredById,
    }
  );

  if (inviterBonusError) {
    console.error(
      "No se pudo sumar bonus al invitador:",
      inviterBonusError
    );
  }

  const { error: invitedBonusError } = await supabase.rpc(
    "add_bonus_analysis",
    {
      user_id_input: userId,
    }
  );

  if (invitedBonusError) {
    console.error(
      "No se pudo sumar bonus al invitado:",
      invitedBonusError
    );
  }
}

      setRegistroExitoso(true);
      setMensaje(
        "Cuenta creada. Revisa tu correo para confirmar tu cuenta. Si no ves el mensaje, revisa la carpeta de spam o promociones."
      );
    } catch {
      setMensaje("Ocurrió un error al crear la cuenta.");
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
      <h1 style={{ fontSize: "32px", margin: 0 }}>Crear cuenta</h1>

      <p style={{ color: "#6b7280", lineHeight: 1.6 }}>
        Crea tu cuenta para guardar tu historial y usar SimpleUS de forma
        personal.
      </p>

      <button
        type="button"
        onClick={continuarConGoogle}
        disabled={registroExitoso}
        style={{
          background: "#ffffff",
          color: "#111827",
          padding: "12px 16px",
          borderRadius: "10px",
          border: "1px solid #d1d5db",
          cursor: registroExitoso ? "not-allowed" : "pointer",
          fontWeight: 600,
          opacity: registroExitoso ? 0.7 : 1,
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
        disabled={registroExitoso}
        style={{
          padding: "12px",
          borderRadius: "10px",
          border: "1px solid #d1d5db",
          background: registroExitoso ? "#f9fafb" : "#ffffff",
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
          disabled={registroExitoso}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            background: registroExitoso ? "#f9fafb" : "#ffffff",
          }}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={registroExitoso}
          style={{
            background: "#ffffff",
            color: "#111827",
            padding: "12px 14px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            cursor: registroExitoso ? "not-allowed" : "pointer",
            fontWeight: 600,
            whiteSpace: "nowrap",
            opacity: registroExitoso ? 0.7 : 1,
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
          disabled={registroExitoso}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            background: registroExitoso ? "#f9fafb" : "#ffffff",
          }}
        />

        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          disabled={registroExitoso}
          style={{
            background: "#ffffff",
            color: "#111827",
            padding: "12px 14px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            cursor: registroExitoso ? "not-allowed" : "pointer",
            fontWeight: 600,
            whiteSpace: "nowrap",
            opacity: registroExitoso ? 0.7 : 1,
          }}
        >
          {showConfirmPassword ? "Ocultar" : "Ver"}
        </button>
      </div>

      <button
        type="button"
        onClick={registrarse}
        disabled={cargando || registroExitoso}
        style={{
          background: cargando || registroExitoso ? "#93c5fd" : "#1d4ed8",
          color: "white",
          padding: "12px 16px",
          borderRadius: "10px",
          border: "none",
          cursor: cargando || registroExitoso ? "not-allowed" : "pointer",
          fontWeight: 600,
        }}
      >
        {cargando
          ? "Creando cuenta..."
          : registroExitoso
          ? "Cuenta creada"
          : "Crear cuenta"}
      </button>

      {mensaje && (
        <div
          style={{
            color: registroExitoso ? "#166534" : "#374151",
            lineHeight: 1.6,
            background: registroExitoso ? "#ecfdf5" : "transparent",
            border: registroExitoso ? "1px solid #86efac" : "none",
            borderRadius: registroExitoso ? "12px" : "0",
            padding: registroExitoso ? "14px 16px" : "0",
          }}
        >
          {mensaje}
        </div>
      )}

      {registroExitoso && (
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/login"
            style={{
              background: "#1d4ed8",
              color: "#ffffff",
              padding: "12px 16px",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Ir a iniciar sesión
          </Link>

          <Link
            href="/"
            style={{
              background: "#ffffff",
              color: "#111827",
              padding: "12px 16px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Volver al inicio
          </Link>
        </div>
      )}
    </div>
  );
}
