"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageContainer from "@/components/layout/page-container";
import { supabase } from "@/lib/supabase";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;

    async function verificarSesion() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!active) return;

        if (!session) {
          setAuthorized(false);
          router.replace("/login");
          return;
        }

        setAuthorized(true);
      } catch {
        if (!active) return;
        setAuthorized(false);
        router.replace("/login");
      }
    }

    verificarSesion();

    return () => {
      active = false;
    };
  }, [router]);

  if (authorized === null) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f9fafb",
          padding: "20px",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "28px",
            minWidth: "280px",
            textAlign: "center",
          }}
        >
          Verificando sesión...
        </div>
      </div>
    );
  }

  if (authorized === false) {
    return null;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f9fafb",
      }}
    >
      <Navbar />

      <PageContainer>{children}</PageContainer>

      <Footer />
    </div>
  );
}
