import Link from "next/link";

export default function ProSuccessPage() {
  return (
    <div style={{ maxWidth: "760px", margin: "0 auto", padding: "40px 20px" }}>
      <section
        style={{
          background: "#ffffff",
          border: "1px solid #bbf7d0",
          borderRadius: "16px",
          padding: "28px",
        }}
      >
        <h1 style={{ marginTop: 0 }}>Pago completado</h1>

        <p style={{ color: "#4b5563", lineHeight: 1.7 }}>
          Tu pago fue procesado por Stripe.
        </p>

        <Link
          href="/dashboard"
          style={{
            display: "inline-block",
            marginTop: "12px",
            background: "#1d4ed8",
            color: "#ffffff",
            padding: "12px 16px",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Volver al dashboard
        </Link>
      </section>
    </div>
  );
}