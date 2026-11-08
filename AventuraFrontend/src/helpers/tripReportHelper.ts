import jsPDF from "jspdf";
import type { TripDto } from "@/models/trip/TripDto";
import type { ExpenseDto } from "@/models/expense/ExpenseDto";
import type { PdfContext } from "./pdf/pdfContext";
import { addCoverPage } from "./pdf/addCoverPage";
import { addSummarySection } from "./pdf/addSumarySection";
import { addDestinationsSection } from "./pdf/addDestinationsSection";
import { addActivitiesSection } from "./pdf/addActivitiesSection";
import { addChecklistSection } from "./pdf/addChecklistSection";
import { addExpensesSection } from "./pdf/addExpensesSection";
import { addFinancialSummary } from "./pdf/addFinancialSummarySection";

interface GenerateTripReportParams {
  trip: TripDto;
  expenses: ExpenseDto[];
}

export const downloadTripReport =
  async ({
    trip,
    expenses,
  }: GenerateTripReportParams) => {
    const doc =
      new jsPDF();

    await addCoverPage(
      doc,
      trip
    );

    const ctx: PdfContext = {
      doc,
      currentY: 20,
    };

    addSummarySection(
      ctx,
      trip
    );

    addDestinationsSection(
      ctx,
      trip
    );

    addActivitiesSection(
      ctx,
      trip
    );

    addChecklistSection(
      ctx,
      trip
    );

    addExpensesSection(
      ctx,
      expenses
    );

    addFinancialSummary(
      ctx,
      trip
    );

    doc.save(
      `${trip.title
        .replace(/\s+/g, "_")
        .toLowerCase()}_trip_report.pdf`
    );
  };