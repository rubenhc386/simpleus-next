import PublicNavbar from "@/components/marketing/public-navbar";
import PublicFooter from "@/components/marketing/public-footer";

export default function Page() {
  const preguntas = [
    {
      pregunta: "¿Qué hace SimpleUS?",
      respuesta:
        "SimpleUS te ayuda a entender cartas importantes en inglés con explicaciones claras en español. Te dice qué es el documento, qué significa, qué tan urgente parece y qué podrías considerar hacer.",
    },
    {
      pregunta: "¿SimpleUS reemplaza a un abogado o experto?",
      respuesta:
        "No. SimpleUS ofrece orientación general y claridad inicial, pero no sustituye asesoría legal, financiera, migratoria o profesional especializada.",
    },
    {
      pregunta: "¿Qué tipos de cartas puedo analizar?",
      respuesta:
        "Puedes usar SimpleUS para cartas del DMV, IRS, seguros, hospitales, bancos, immigration, utilities, multas y otros documentos administrativos en inglés.",
    },
    {
      pregunta: "¿Puedo analizar una foto o un PDF?",
      respuesta:
        "Sí. SimpleUS permite analizar texto, foto y PDF. Algunas funciones siguen evolucionando para ofrecer mejores resultados con el tiempo.",
    },
    {
      pregunta: "¿Cuántos análisis incluye el plan gratis?",
      respuesta:
        "Actualmente el plan gratuito incluye 3 análisis base durante el periodo de prueba y también puede aumentar con recompensas por referidos.",
    },
    {
      pregunta: "¿Qué incluye SimpleUS Pro?",
      respuesta:
        "SimpleUS Pro te da análisis ilimitados, mejor continuidad en tu cuenta, historial completo y acceso a funciones que seguiremos ampliando.",
    },
    {
      pregunta: "¿Se guarda mi historial?",
      respuesta:
        "Sí. Tu cuenta puede guardar tus análisis para que después vuelvas a consultarlos con más facilidad.",
    },
    {
      pregunta: "¿SimpleUS está pensado para hispanohablantes en Estados Unidos?",
      respuesta:
        "Sí. Todo el enfoque del producto está pensado para ayudar a la comunidad hispana en EE.UU. a entender documentos importantes con más claridad y menos estrés.",
    },
  ];

  return (
    <>
      <PublicNavbar />

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "40px 20px 60px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "28px",
        }}
      >
        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "32px",
          }}
        >
          <div
            style={{
              display: "inline-block",
              fontSize: "13px",
              color: "#1d4ed8",
              fontWeight: 600,
              marginBottom: "12px",
            }}
          >
            Preguntas frecuentes
          </div>

          <h1
            style={{
              fontSize: "40px",
              lineHeight: 1.15,
              margin: "0 0 16px 0",
            }}
          >
            Respuestas claras sobre SimpleUS
          </h1>

          <p
            style={{
              color: "#4b5563",
              lineHeight: 1.8,
              fontSize: "17px",
              margin: 0,
            }}
          >
            Aquí encontrarás respuestas rápidas sobre cómo funciona SimpleUS,
            qué tipo de cartas puedes analizar y qué esperar del producto.
          </p>
        </section>

        <section
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {preguntas.map((item, index) => (
            <div
              key={index}
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "24px",
              }}
            >
              <h2
                style={{
                  fontSize: "22px",
                  margin: "0 0 10px 0",
                }}
              >
                {item.pregunta}
              </h2>

              <p
                style={{
                  color: "#4b5563",
                  lineHeight: 1.8,
                  margin: 0,
                }}
              >
                {item.respuesta}
              </p>
            </div>
          ))}
        </section>
      </div>

      <PublicFooter />
    </>
  );
}