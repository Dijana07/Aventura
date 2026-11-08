import type { TripDto } from "@/models/trip/TripDto";

import {
  addSectionTitle,
  ensureSpace,
  type PdfContext,
} from "./pdfContext";

export const addChecklistSection =
  (
    ctx: PdfContext,
    trip: TripDto
  ) => {
    if (
      trip.checklistItems.length ===
      0
    )
      return;

    addSectionTitle(
      ctx,
      "Checklist"
    );

    ensureSpace(
      ctx,
      trip.checklistItems.length *
        8 +
        20
    );

    ctx.doc.roundedRect(
      14,
      ctx.currentY,
      182,
      trip.checklistItems.length *
        8 +
        10,
      3,
      3
    );

    ctx.currentY += 8;

    ctx.doc.setFontSize(11);
    trip.checklistItems.forEach(
      (item) => {
        if (
          item.isChecked
        ) {
          ctx.doc.setTextColor(
            34,
            197,
            94
          );
        } else {
          ctx.doc.setTextColor(
            120,
            120,
            120
          );
        }

        ctx.doc.text(
          `${
            item.isChecked
              ? "[x]"
              : "[ ]"
          } ${item.title}`,
          20,
          ctx.currentY
        );

        ctx.currentY += 8;
      }
    );

    ctx.doc.setTextColor(
      0,
      0,
      0
    );
    ctx.doc.setFontSize(18);
    ctx.currentY += 10;
  };