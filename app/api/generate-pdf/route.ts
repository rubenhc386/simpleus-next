export const runtime = "nodejs";

const PDFDocument = require("pdfkit");

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const { tipo, significado, urgencia, pasos, checklist, calma } = data;

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
      .text("Mapa SimpleUS", { align: "center" })
      .moveDown();

    doc
      .fontSize(11)
      .fillColor("#444444")
      .text(`Fecha: ${new Date().toLocaleDateString()}`)
      .moveDown();

    doc.fillColor("#000000").fontSize(14).text("Qué es esta carta:", {
      underline: true,
    });
    doc.moveDown(0.3);
    doc.fontSize(12).text(tipo || "");
    doc.moveDown();

    doc.fontSize(14).text("Qué significa:", {
      underline: true,
    });
    doc.moveDown(0.3);
    doc.fontSize(12).text(significado || "");
    doc.moveDown();

    doc.fontSize(14).text("Nivel de urgencia:", {
      underline: true,
    });
    doc.moveDown(0.3);
    doc.fontSize(12).text(urgencia || "");
    doc.moveDown();

    doc.fontSize(14).text("Qué podrías hacer:", {
      underline: true,
    });
    doc.moveDown(0.3);

    (pasos || []).forEach((paso: string, index: number) => {
      doc.fontSize(12).text(`${index + 1}. ${paso}`);
    });

    doc.moveDown();

    if (checklist && checklist.length > 0) {
      doc.fontSize(14).text("Checklist recomendado:", {
        underline: true,
      });
      doc.moveDown(0.3);

      checklist.forEach((item: string) => {
        doc.fontSize(12).text(`[ ] ${item}`);
      });

      doc.moveDown();
    }

    doc.fontSize(14).text("Mensaje de calma:", {
      underline: true,
    });
    doc.moveDown(0.3);
    doc.fontSize(12).text(calma || "");
    doc.moveDown(2);

    doc
      .fontSize(10)
      .fillColor("gray")
      .text("SimpleUS by RubenHC3_ · No es asesoría legal", {
        align: "center",
      });

    doc.end();

    const pdfBuffer = await endPromise;

    return new Response(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="mapa-simpleus.pdf"',
        "Content-Length": String(pdfBuffer.length),
        "Cache-Control": "no-store",
      },
    });
  } catch (error: any) {
    console.error("Error generando PDF:", error);

    return Response.json(
      {
        error: "No se pudo generar el PDF.",
        details: error?.message || null,
      },
      { status: 500 }
    );
  }
}