import TripsDashboard from "@/components/trip/TripsDashboard";
import AppLayout from "@/layout/AppLayout";
import type { TripPreviewDto } from "@/models/trip/TripPreviewDto";
import { tripService } from "@/services/tripService";
import { useEffect, useState } from "react";

export default function TripsManagementPage() {
  const [tripPreviews, setTripPreviews] = useState<TripPreviewDto[]>([]); 

  useEffect(() => {
    const fetchTripPreviews = async () => {
      const result = await tripService.getAllTripPreviewsForAdmin();
      if (result.success && result.data) {
        setTripPreviews(result.data);
      }
    };

    fetchTripPreviews();
  }, []);

  return (
    <AppLayout>
      <div className="w-full mx-auto">
        {tripPreviews.length > 0 ? (
          <div className="my-5">
            <h2 className="text-2xl font-bold text-white mb-3">
              All trips in the system
            </h2>
            <TripsDashboard trips={tripPreviews} />
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-white/70">
              There are no trips in the system.
            </p>
            <p className="mt-2 text-sm text-white/50">
                When users create trips, they will appear here for admin management.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}