import jsPDF from "jspdf";

export interface PdfContext {
  doc: jsPDF;
  currentY: number;
}

export const ensureSpace = (
  ctx: PdfContext,
  height: number
) => {
  if (ctx.currentY + height > 270) {
    ctx.doc.addPage();
    ctx.currentY = 20;
  }
};

export const addSectionTitle = (
  ctx: PdfContext,
  title: string
) => {
  ensureSpace(ctx, 20);

  ctx.doc.setFont(
    "helvetica",
    "bold"
  );

  ctx.doc.setFontSize(18);

  ctx.doc.text(
    title,
    14,
    ctx.currentY
  );

  ctx.currentY += 10;
};

export const addCard = (
  ctx: PdfContext,
  lines: string[]
) => {
  const height =
    lines.length * 6 + 12;

  ensureSpace(ctx, height);

  ctx.doc.roundedRect(
    14,
    ctx.currentY,
    182,
    height,
    3,
    3
  );

  let y = ctx.currentY + 8;

  ctx.doc.setFontSize(11);

  ctx.doc.setFont(
    "helvetica",
    "normal"
  );

  lines.forEach((line) => {
    ctx.doc.text(
      line,
      18,
      y
    );

    y += 6;
  });

  ctx.currentY += height + 8;
};