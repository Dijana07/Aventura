import type { TripDto } from "@/models/trip/TripDto";

import {
  addCard,
  addSectionTitle,
  type PdfContext,
} from "./pdfContext";

export const addActivitiesSection =
  (
    ctx: PdfContext,
    trip: TripDto
  ) => {
    if (
      trip.activities.length ===
      0
    )
      return;

    addSectionTitle(
      ctx,
      "Activities"
    );

    trip.activities.forEach(
      (activity) => {
        let status = "";

        switch (activity.activityStatus) {
        case "DONE":
            status = "[DONE]";
            break;

        case "RESERVED":
            status = "[RESERVED]";
            break;

        case "CANCELLED":
            status = "[CANCELLED]";
            break;

        default:
            status = "[PLANNED]";
        }

        addCard(ctx, [
          `${activity.title}`,
          `${status}`,
          `Location: ${activity.location}`,
          `Budget: €${activity.budget.toFixed(
            2
          )}`,
          `Start: ${new Date(
            activity.startDateTime
          ).toLocaleString()}`,
          `End: ${new Date(
            activity.endDateTime
          ).toLocaleString()}`,
        ]);
      }
    );
  };