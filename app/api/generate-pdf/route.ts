import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type GeneratePdfPayload = {
  tipo?: string;
  significado?: string;
  urgencia?: string;
  pasos?: string[];
  checklist?: string[];
  calma?: string;
};

function drawWrappedText(
  page: any,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  font: any,
  size: number,
  color = rgb(0, 0, 0),
  lineHeight = 18
) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, size);

    if (width > maxWidth && line) {
      page.drawText(line, {
        x,
        y: currentY,
        size,
        font,
        color,
      });
      line = word;
      currentY -= lineHeight;
    } else {
      line = testLine;
    }
  }

  if (line) {
    page.drawText(line, {
      x,
      y: currentY,
      size,
      font,
      color,
    });
    currentY -= lineHeight;
  }

  return currentY;
}

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

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4
    const { width, height } = page.getSize();

    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const margin = 50;
    const contentWidth = width - margin * 2;
    let y = height - 60;

    page.drawText("Mapa SimpleUS", {
      x: margin,
      y,
      size: 20,
      font: fontBold,
      color: rgb(0.07, 0.11, 0.16),
    });

    y -= 28;

    page.drawText(`Fecha: ${new Date().toLocaleDateString("es-US")}`, {
      x: margin,
      y,
      size: 11,
      font: fontRegular,
      color: rgb(0.42, 0.45, 0.5),
    });

    y -= 30;

    page.drawText("Qué es esta carta:", {
      x: margin,
      y,
      size: 14,
      font: fontBold,
      color: rgb(0.07, 0.11, 0.16),
    });
    y -= 20;
    y = drawWrappedText(
      page,
      tipo || "Sin información.",
      margin,
      y,
      contentWidth,
      fontRegular,
      12,
      rgb(0.22, 0.25, 0.32)
    );
    y -= 12;

    page.drawText("Qué significa:", {
      x: margin,
      y,
      size: 14,
      font: fontBold,
      color: rgb(0.07, 0.11, 0.16),
    });
    y -= 20;
    y = drawWrappedText(
      page,
      significado || "Sin información.",
      margin,
      y,
      contentWidth,
      fontRegular,
      12,
      rgb(0.22, 0.25, 0.32)
    );
    y -= 12;

    page.drawText("Nivel de urgencia:", {
      x: margin,
      y,
      size: 14,
      font: fontBold,
      color: rgb(0.07, 0.11, 0.16),
    });
    y -= 20;
    y = drawWrappedText(
      page,
      urgencia || "Sin información.",
      margin,
      y,
      contentWidth,
      fontRegular,
      12,
      rgb(0.22, 0.25, 0.32)
    );
    y -= 12;

    page.drawText("Qué podrías hacer:", {
      x: margin,
      y,
      size: 14,
      font: fontBold,
      color: rgb(0.07, 0.11, 0.16),
    });
    y -= 20;

    if (pasos.length > 0) {
      for (let i = 0; i < pasos.length; i++) {
        y = drawWrappedText(
          page,
          `${i + 1}. ${pasos[i]}`,
          margin,
          y,
          contentWidth,
          fontRegular,
          12,
          rgb(0.22, 0.25, 0.32)
        );
        y -= 6;
      }
    } else {
      y = drawWrappedText(
        page,
        "No hay pasos disponibles.",
        margin,
        y,
        contentWidth,
        fontRegular,
        12,
        rgb(0.22, 0.25, 0.32)
      );
    }

    y -= 12;

    if (checklist.length > 0) {
      page.drawText("Checklist recomendado:", {
        x: margin,
        y,
        size: 14,
        font: fontBold,
        color: rgb(0.07, 0.11, 0.16),
      });
      y -= 20;

      for (const item of checklist) {
        y = drawWrappedText(
          page,
          `[ ] ${item}`,
          margin,
          y,
          contentWidth,
          fontRegular,
          12,
          rgb(0.22, 0.25, 0.32)
        );
        y -= 6;
      }

      y -= 12;
    }

    page.drawText("Mensaje de calma:", {
      x: margin,
      y,
      size: 14,
      font: fontBold,
      color: rgb(0.07, 0.11, 0.16),
    });
    y -= 20;
    y = drawWrappedText(
      page,
      calma || "Sin mensaje.",
      margin,
      y,
      contentWidth,
      fontRegular,
      12,
      rgb(0.22, 0.25, 0.32)
    );

    page.drawText("SimpleUS by RubenHC3_ · No es asesoría legal", {
      x: margin,
      y: 30,
      size: 10,
      font: fontRegular,
      color: rgb(0.62, 0.64, 0.69),
    });

const pdfBytes = await pdfDoc.save();

const pdfArrayBuffer = pdfBytes.buffer.slice(
  pdfBytes.byteOffset,
  pdfBytes.byteOffset + pdfBytes.byteLength
) as ArrayBuffer;

return new Response(pdfArrayBuffer, {
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