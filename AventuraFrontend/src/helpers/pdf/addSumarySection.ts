import type { TripDto } from "@/models/trip/TripDto";

import {
  addCard,
  addSectionTitle,
  type PdfContext,
} from "./pdfContext";

export const addSummarySection =
  (
    ctx: PdfContext,
    trip: TripDto
  ) => {
    const budgetLeft =
      trip.budget -
      trip.totalExpenses;

    addSectionTitle(
      ctx,
      "Trip Summary"
    );

    addCard(ctx, [
      `Budget: €${trip.budget.toFixed(
        2
      )}`,
      `Spent: €${trip.totalExpenses.toFixed(
        2
      )}`,
      `Remaining: €${budgetLeft.toFixed(
        2
      )}`,
      `Destinations: ${trip.destinations.length}`,
      `Activities: ${trip.activities.length}`,
      `Checklist Items: ${trip.checklistItems.length}`,
    ]);

    if (trip.notes) {
      addSectionTitle(
        ctx,
        "Trip Notes"
      );

      const lines =
        ctx.doc.splitTextToSize(
          trip.notes,
          170
        );

      addCard(ctx, lines);
    }
  };