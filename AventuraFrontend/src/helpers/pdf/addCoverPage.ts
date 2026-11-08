import jsPDF from "jspdf";
import type { TripDto } from "@/models/trip/TripDto";

const loadImageAsDataUrl =
  async (
    url: string
  ): Promise<string> => {
    const response =
      await fetch(url);

    const blob =
      await response.blob();

    return new Promise(
      (resolve) => {
        const reader =
          new FileReader();

        reader.onloadend = () =>
          resolve(
            reader.result as string
          );

        reader.readAsDataURL(
          blob
        );
      }
    );
  };

export const addCoverPage =
  async (
    doc: jsPDF,
    trip: TripDto
  ) => {
    if (trip.photoUrl) {
      try {
        const image =
          await loadImageAsDataUrl(
            trip.photoUrl
          );

        doc.addImage(
          image,
          "JPEG",
          0,
          0,
          210,
          297
        );
      } catch {}
    }

    doc.setTextColor(
      255,
      255,
      255
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(28);

    doc.text(
      "TRIP REPORT",
      105,
      70,
      {
        align: "center",
      }
    );

    doc.setFontSize(22);

    doc.text(
      trip.title,
      105,
      90,
      {
        align: "center",
      }
    );

    doc.setFontSize(12);

    doc.text(
      `${new Date(
        trip.startDate
      ).toLocaleDateString()} - ${new Date(
        trip.endDate
      ).toLocaleDateString()}`,
      105,
      105,
      {
        align: "center",
      }
    );

    doc.addPage();

    doc.setTextColor(
      0,
      0,
      0
    );
  };