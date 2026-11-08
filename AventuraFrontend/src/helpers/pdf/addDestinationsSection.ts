import type { TripDto } from "@/models/trip/TripDto";

import {
  addCard,
  addSectionTitle,
  type PdfContext,
} from "./pdfContext";

export const addDestinationsSection =
  (
    ctx: PdfContext,
    trip: TripDto
  ) => {
    if (
      trip.destinations.length ===
      0
    )
      return;

    addSectionTitle(
      ctx,
      "Destinations"
    );

    trip.destinations.forEach(
      (destination) => {
        addCard(ctx, [
          `${destination.title}`,
          `Location: ${destination.location}`,
          `From: ${new Date(
            destination.startDate
          ).toLocaleDateString()}`,
          `To: ${new Date(
            destination.endDate
          ).toLocaleDateString()}`,
          destination.notes
            ? `Notes: ${destination.notes}`
            : "",
        ].filter(Boolean));
      }
    );
  };