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

    const endPromise = new Promise<Buffer>((resolve, reject) => {
      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });

      doc.on("error", (err: Error) => {
        reject(err);
      });
    });

    doc
      .fontSize(20)
      .fillColor("#000000")
      .text("Mapa SimpleUS", { align: "center" })
      .moveDown();

    doc
      .fontSize(11)
      .fillColor("#444444")
      .text(`Fecha: ${new Date().toLocaleDateString("es-US")}`)
      .moveDown();

    doc.fillColor("#000000").fontSize(14).text("Qué es esta carta:", {
      underline: true,
    });
    doc.moveDown(0.3);
    doc.fontSize(12).fillColor("#000000").text(tipo);
    doc.moveDown();

    doc.fontSize(14).fillColor("#000000").text("Qué significa:", {
      underline: true,
    });
    doc.moveDown(0.3);
    doc.fontSize(12).fillColor("#000000").text(significado);
    doc.moveDown();

    doc.fontSize(14).fillColor("#000000").text("Nivel de urgencia:", {
      underline: true,
    });
    doc.moveDown(0.3);
    doc.fontSize(12).fillColor("#000000").text(urgencia);
    doc.moveDown();

    doc.fontSize(14).fillColor("#000000").text("Qué podrías hacer:", {
      underline: true,
    });
    doc.moveDown(0.3);

    pasos.forEach((paso: string, index: number) => {
      doc.fontSize(12).fillColor("#000000").text(`${index + 1}. ${paso}`);
    });

    doc.moveDown();

    if (checklist.length > 0) {
      doc.fontSize(14).fillColor("#000000").text("Checklist recomendado:", {
        underline: true,
      });
      doc.moveDown(0.3);

      checklist.forEach((item: string) => {
        doc.fontSize(12).fillColor("#000000").text(`[ ] ${item}`);
      });

      doc.moveDown();
    }

    doc.fontSize(14).fillColor("#000000").text("Mensaje de calma:", {
      underline: true,
    });
    doc.moveDown(0.3);
    doc.fontSize(12).fillColor("#000000").text(calma);
    doc.moveDown(2);

    doc
      .fontSize(10)
      .fillColor("gray")
      .text("SimpleUS by RubenHC3_ · No es asesoría legal", {
        align: "center",
      });

    doc.end();

const pdfBuffer = await endPromise;
const pdfBytes = Uint8Array.from(pdfBuffer);

const pdfBlob = new Blob([pdfBytes], {
  type: "application/pdf",
});

return new Response(pdfBlob, {
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