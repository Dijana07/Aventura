import type { TripDto } from "@/models/trip/TripDto";

import {
  addSectionTitle,
  ensureSpace,
  type PdfContext,
} from "./pdfContext";

export const addFinancialSummary =
  (
    ctx: PdfContext,
    trip: TripDto
  ) => {
    const budgetLeft =
      trip.budget -
      trip.totalExpenses;

    addSectionTitle(
      ctx,
      "Financial Summary"
    );

    ensureSpace(ctx, 60);

    ctx.doc.setFontSize(12);

    ctx.doc.text(
      `Budget: €${trip.budget.toFixed(
        2
      )}`,
      14,
      ctx.currentY
    );

    ctx.currentY += 8;

    ctx.doc.text(
      `Spent: €${trip.totalExpenses.toFixed(
        2
      )}`,
      14,
      ctx.currentY
    );

    ctx.currentY += 8;

    ctx.doc.text(
      `Remaining: €${budgetLeft.toFixed(
        2
      )}`,
      14,
      ctx.currentY
    );

    ctx.currentY += 15;

    const progressWidth =
      160;

    const spentWidth =
      trip.budget > 0
        ? Math.min(
            progressWidth,
            (trip.totalExpenses /
              trip.budget) *
              progressWidth
          )
        : 0;

    let color: [
      number,
      number,
      number
    ];

    if (
      trip.totalExpenses >
      trip.budget
    ) {
      color = [
        220, 38, 38,
      ];
    } else if (
      trip.totalExpenses >
      trip.budget * 0.8
    ) {
      color = [
        245, 158, 11,
      ];
    } else {
      color = [
        34, 197, 94,
      ];
    }

    ctx.doc.rect(
      14,
      ctx.currentY,
      progressWidth,
      8
    );

    ctx.doc.setFillColor(
      color[0],
      color[1],
      color[2]
    );

    ctx.doc.rect(
      14,
      ctx.currentY,
      spentWidth,
      8,
      "F"
    );

    ctx.currentY += 15;

    const percent =
      trip.budget > 0
        ? (
            (trip.totalExpenses /
              trip.budget) *
            100
          ).toFixed(1)
        : "0";

    ctx.doc.text(
      `${percent}% of budget used`,
      14,
      ctx.currentY
    );
  };