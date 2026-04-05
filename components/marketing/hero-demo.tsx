"use client";

import { useMemo, useState } from "react";

function generarRespuestaDemo(texto: string) {
  const t = texto.toLowerCase();

  if (!texto.trim()) {
    return {
      tipo: "Ejemplo de carta",
      significado:
        "Aquí verías una explicación simple en español sobre el documento.",
      urgencia: "Media",
      pasos: [
        "Leer con calma el contenido principal.",
        "Identificar si hay una fecha límite.",
        "Revisar qué acción pide la carta.",
      ],
    };
  }

  if (t.includes("dmv")) {
    return {
      tipo: "Carta del DMV",
      significado:
        "Parece un aviso relacionado con licencia, registro o trámite vehicular.",
      urgencia: "Media",
      pasos: [
        "Revisar si menciona fecha límite.",
        "Verificar número de caso o referencia.",
        "Prepararte para responder o acudir a la oficina correspondiente.",
      ],
    };
  }

  if (t.includes("irs") || t.includes("tax")) {
    return {
      tipo: "Carta del IRS / impuestos",
      significado:
        "Parece una notificación relacionada con impuestos, revisión o saldo pendiente.",
      urgencia: "Alta",
      pasos: [
        "No ignorar la carta.",
        "Revisar montos, periodos y fechas.",
        "Confirmar si necesitas responder pronto.",
      ],
    };
  }

  if (t.includes("hospital") || t.includes("medical") || t.includes("bill")) {
    return {
      tipo: "Carta médica / cobro hospitalario",
      significado:
        "Parece un documento médico o una factura relacionada con atención de salud.",
      urgencia: "Media",
      pasos: [
        "Identificar si es factura, aviso o explicación de beneficios.",
        "Revisar montos y fechas.",
        "Confirmar si corresponde a un servicio real.",
      ],
    };
  }

  return {
    tipo: "Carta administrativa",
    significado:
      "Parece un documento importante que requiere revisión para entender qué significa y qué hacer después.",
    urgencia: "Media",
    pasos: [
      "Leer con calma la parte principal.",
      "Buscar fechas límite o acciones solicitadas.",
      "Preparar la siguiente acción adecuada.",
    ],
  };
}

export default function HeroDemo() {
  const [texto, setTexto] = useState(
    "IRS Notice: You may need to respond by mail within 30 days."
  );

  const respuesta = useMemo(() => generarRespuestaDemo(texto), [texto]);

  return (
    <div
      style={{
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div>
        <strong style={{ fontSize: "18px", color: "#111827" }}>
          Prueba una demo rápida
        </strong>
        <p
          style={{
            margin: "8px 0 0 0",
            color: "#6b7280",
            lineHeight: 1.6,
            fontSize: "14px",
          }}
        >
          Pega un fragmento de carta y mira cómo SimpleUS lo explicaría. Esta
          demo no consume análisis reales.
        </p>
      </div>

      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Pega aquí un fragmento de carta..."
        style={{
          width: "100%",
          minHeight: "130px",
          padding: "14px",
          borderRadius: "12px",
          border: "1px solid #d1d5db",
          fontSize: "14px",
          lineHeight: 1.6,
          resize: "vertical",
          boxSizing: "border-box",
        }}
      />

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "14px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div>
          <strong style={{ color: "#111827" }}>Qué es esta carta</strong>
          <p style={{ margin: "6px 0 0 0", color: "#4b5563", lineHeight: 1.6 }}>
            {respuesta.tipo}
          </p>
        </div>

        <div>
          <strong style={{ color: "#111827" }}>Qué significa</strong>
          <p style={{ margin: "6px 0 0 0", color: "#4b5563", lineHeight: 1.6 }}>
            {respuesta.significado}
          </p>
        </div>

        <div>
          <strong style={{ color: "#111827" }}>Nivel de urgencia</strong>
          <p style={{ margin: "6px 0 0 0", color: "#4b5563", lineHeight: 1.6 }}>
            {respuesta.urgencia}
          </p>
        </div>

        <div>
          <strong style={{ color: "#111827" }}>Qué podrías hacer</strong>
          <ul
            style={{
              margin: "8px 0 0 0",
              paddingLeft: "20px",
              color: "#4b5563",
              lineHeight: 1.8,
            }}
          >
            {respuesta.pasos.map((paso, index) => (
              <li key={index}>{paso}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}