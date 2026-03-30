const PDFDocument = require("pdfkit");

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const { tipo, significado, urgencia, pasos, checklist, calma } = data;

    const doc = new PDFDocument();

    const chunks: Uint8Array[] = [];

    doc.on("data", (chunk: Uint8Array) => chunks.push(chunk));

    const endPromise = new Promise<Buffer>((resolve) => {
      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
    });

    doc.fontSize(20).text("Mapa SimpleUS", { align: "center" }).moveDown();

    doc.fontSize(12).text(`Fecha: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    doc.fontSize(14).text("Qué es esta carta:", { underline: true });
    doc.fontSize(12).text(tipo || "");
    doc.moveDown();

    doc.fontSize(14).text("Qué significa:", { underline: true });
    doc.fontSize(12).text(significado || "");
    doc.moveDown();

    doc.fontSize(14).text("Nivel de urgencia:", { underline: true });
    doc.fontSize(12).text(urgencia || "");
    doc.moveDown();

    doc.fontSize(14).text("Qué podrías hacer:", { underline: true });
    (pasos || []).forEach((p: string, i: number) => {
      doc.text(`${i + 1}. ${p}`);
    });
    doc.moveDown();

    if (checklist && checklist.length > 0) {
      doc.fontSize(14).text("Checklist recomendado:", { underline: true });
      checklist.forEach((c: string) => {
        doc.text(`☐ ${c}`);
      });
      doc.moveDown();
    }

    doc.fontSize(14).text("Mensaje de calma:", { underline: true });
    doc.fontSize(12).text(calma || "");
    doc.moveDown();

    doc
      .fontSize(10)
      .fillColor("gray")
      .text("SimpleUS by RubenHC3_ · No es asesoría legal", {
        align: "center",
      });

    doc.end();

    const pdfBuffer = await endPromise;
    const pdfBytes = new Uint8Array(pdfBuffer);

    return new Response(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=mapa-simpleus.pdf",
      },
    });
  } catch (error) {
    console.error("Error generando PDF:", error);

    return Response.json(
      { error: "No se pudo generar el PDF." },
      { status: 500 }
    );
  }
}
