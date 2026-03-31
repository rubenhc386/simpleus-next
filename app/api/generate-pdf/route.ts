export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PDFDocument = require("pdfkit");

type GeneratePdfPayload = {
  tipo?: string;
  significado?: string;
  urgencia?: string;
  pasos?: string[];
  checklist?: string[];
  calma?: string;
};

export async function POST(req: Request) {
  try {
    const data = (await req.json()) as GeneratePdfPayload;

    const tipo = typeof data?.tipo === "string" ? data.tipo : "";
    const significado =
      typeof data?.significado === "string" ? data.significado : "";
    const urgencia = typeof data?.urgencia === "string" ? data.urgencia : "";
    const calma = typeof data?.calma === "string" ? data.calma : "";
    const pasos = Array.isArray(data?.pasos) ? data.pasos : [];
    const checklist = Array.isArray(data?.checklist) ? data.checklist : [];

    const doc = new PDFDocument({
      margin: 50,
      size: "A4",
    });

    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });

    const pdfBufferPromise = new Promise<Buffer>((resolve, reject) => {
      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });

      doc.on("error", (err: Error) => {
        reject(err);
      });
    });

    // Fuente interna de PDFKit para evitar problemas
    doc.font("Helvetica");

    doc.fontSize(20).fillColor("black").text("Mapa SimpleUS", {
      align: "center",
    });

    doc.moveDown();
    doc.fontSize(11).fillColor("gray").text(
      `Fecha: ${new Date().toLocaleDateString("es-US")}`
    );

    doc.moveDown();

    doc.fontSize(14).fillColor("black").text("Qué es esta carta:", {
      underline: true,
    });
    doc.moveDown(0.3);
    doc.fontSize(12).fillColor("black").text(tipo || "Sin información.");

    doc.moveDown();

    doc.fontSize(14).fillColor("black").text("Qué significa:", {
      underline: true,
    });
    doc.moveDown(0.3);
    doc.fontSize(12).fillColor("black").text(significado || "Sin información.");

    doc.moveDown();

    doc.fontSize(14).fillColor("black").text("Nivel de urgencia:", {
      underline: true,
    });
    doc.moveDown(0.3);
    doc.fontSize(12).fillColor("black").text(urgencia || "Sin información.");

    doc.moveDown();

    doc.fontSize(14).fillColor("black").text("Qué podrías hacer:", {
      underline: true,
    });
    doc.moveDown(0.3);

    if (pasos.length > 0) {
      pasos.forEach((paso: string, index: number) => {
        doc.fontSize(12).fillColor("black").text(`${index + 1}. ${paso}`);
      });
    } else {
      doc.fontSize(12).fillColor("black").text("No hay pasos disponibles.");
    }

    doc.moveDown();

    if (checklist.length > 0) {
      doc.fontSize(14).fillColor("black").text("Checklist recomendado:", {
        underline: true,
      });
      doc.moveDown(0.3);

      checklist.forEach((item: string) => {
        doc.fontSize(12).fillColor("black").text(`[ ] ${item}`);
      });

      doc.moveDown();
    }

    doc.fontSize(14).fillColor("black").text("Mensaje de calma:", {
      underline: true,
    });
    doc.moveDown(0.3);
    doc.fontSize(12).fillColor("black").text(calma || "Sin mensaje.");

    doc.moveDown(2);
    doc.fontSize(10).fillColor("gray").text(
      "SimpleUS by RubenHC3_ · No es asesoría legal",
      { align: "center" }
    );

    doc.end();

    const pdfBuffer = await pdfBufferPromise;

    return new Response(pdfBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="mapa-simpleus.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error: any) {
    console.error("Error generando PDF:", error);

    return Response.json(
      {
        error: "No se pudo generar el PDF.",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}