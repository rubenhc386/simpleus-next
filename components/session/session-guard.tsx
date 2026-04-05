"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

const IDLE_TIME_MS = 30 * 60 * 1000; // 30 minutos

export default function SessionGuard() {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function limpiarTimer() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }

  async function cerrarSesionYRedirigir() {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error cerrando sesión por inactividad:", error);
    } finally {
      window.location.href = "/";
    }
  }

  function reiniciarTimer() {
    limpiarTimer();

    timeoutRef.current = setTimeout(() => {
      cerrarSesionYRedirigir();
    }, IDLE_TIME_MS);
  }

  useEffect(() => {
    const eventos = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ] as const;

    function handleActivity() {
      reiniciarTimer();
    }

    async function validarSesionAlVolver() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          window.location.href = "/";
          return;
        }

        reiniciarTimer();
      } catch (error) {
        console.error("Error validando sesión al volver a la pestaña:", error);
        window.location.href = "/";
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        validarSesionAlVolver();
      }
    }

    eventos.forEach((evento) => {
      window.addEventListener(evento, handleActivity);
    });

    document.addEventListener("visibilitychange", handleVisibilityChange);

    reiniciarTimer();

    return () => {
      limpiarTimer();

      eventos.forEach((evento) => {
        window.removeEventListener(evento, handleActivity);
      });

      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
}