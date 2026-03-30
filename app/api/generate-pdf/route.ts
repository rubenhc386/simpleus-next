import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 10;

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

    // Ruta de la fuente personalizada
    const fontPath = path.join(process.cwd(), "public", "fonts", "Inter-VariableFont_opsz,wght.ttf");

    // Si existe la fuente, úsala. Si no, usa Helvetica.
    if (fs.existsSync(fontPath)) {
      doc.font(fontPath);
    } else {
      doc.font("Helvetica");
    }

    doc
      .fillColor("#111827")
      .fontSize(20)
      .text("Mapa SimpleUS", { align: "center" })
      .moveDown();

    doc
      .fontSize(11)
      .fillColor("#6b7280")
      .text(`Fecha: ${new Date().toLocaleDateString("es-US")}`)
      .moveDown();

    doc
      .fontSize(14)
      .fillColor("#111827")
      .text("Qué es esta carta:", { underline: true });
    doc.moveDown(0.3);
    doc.fontSize(12).fillColor("#374151").text(tipo || "Sin información.");
    doc.moveDown();

    doc
      .fontSize(14)
      .fillColor("#111827")
      .text("Qué significa:", { underline: true });
    doc.moveDown(0.3);
    doc
      .fontSize(12)
      .fillColor("#374151")
      .text(significado || "Sin información.");
    doc.moveDown();

    doc
      .fontSize(14)
      .fillColor("#111827")
      .text("Nivel de urgencia:", { underline: true });
    doc.moveDown(0.3);
    doc.fontSize(12).fillColor("#374151").text(urgencia || "Sin información.");
    doc.moveDown();

    doc
      .fontSize(14)
      .fillColor("#111827")
      .text("Qué podrías hacer:", { underline: true });
    doc.moveDown(0.3);

    if (pasos.length > 0) {
      pasos.forEach((paso: string, index: number) => {
        doc.fontSize(12).fillColor("#374151").text(`${index + 1}. ${paso}`);
      });
    } else {
      doc.fontSize(12).fillColor("#374151").text("No hay pasos disponibles.");
    }

    doc.moveDown();

    if (checklist.length > 0) {
      doc
        .fontSize(14)
        .fillColor("#111827")
        .text("Checklist recomendado:", { underline: true });
      doc.moveDown(0.3);

      checklist.forEach((item: string) => {
        doc.fontSize(12).fillColor("#374151").text(`[ ] ${item}`);
      });

      doc.moveDown();
    }

    doc
      .fontSize(14)
      .fillColor("#111827")
      .text("Mensaje de calma:", { underline: true });
    doc.moveDown(0.3);
    doc.fontSize(12).fillColor("#374151").text(calma || "Sin mensaje.");
    doc.moveDown(2);

    doc
      .fontSize(10)
      .fillColor("#9ca3af")
      .text("SimpleUS by RubenHC3_ · No es asesoría legal", {
        align: "center",
      });

    doc.end();

    const pdfBuffer = await endPromise;

    // Convertimos a ArrayBuffer limpio para Response
    const pdfBytes = Uint8Array.from(pdfBuffer);
    const arrayBuffer = pdfBytes.buffer.slice(
      pdfBytes.byteOffset,
      pdfBytes.byteOffset + pdfBytes.byteLength
    ) as ArrayBuffer;

    return new Response(arrayBuffer, {
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