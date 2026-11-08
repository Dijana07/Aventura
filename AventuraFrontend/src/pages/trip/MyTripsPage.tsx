import TripsDashboard from "@/components/trip/TripsDashboard";
import AppLayout from "@/layout/AppLayout";
import type { TripPreviewDto } from "@/models/trip/TripPreviewDto";
import { tripService } from "@/services/tripService";
import { useEffect, useState } from "react";
import AddTripModal from "../../components/trip/AddTripModal";

export default function MyTripsPage() {
  const [tripPreviews, setTripPreviews] = useState<TripPreviewDto[]>([]); 
  const [addTripModalOpen, setAddTripModalOpen] = useState(false);

  useEffect(() => {
    const fetchTripPreviews = async () => {
      const result = await tripService.getTripPreviews();
      if (result.success && result.data) {
        setTripPreviews(result.data);
      }
    };

    fetchTripPreviews();
  }, []);

  return (
    <AppLayout>
      {
        addTripModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-md rounded-lg bg-background-100 p-6">
              <button
                onClick={() => setAddTripModalOpen(false)}
                className="absolute right-4 top-2 text-4xl text-white"
              >
                &times;
              </button>

              <AddTripModal />
            </div>
          </div>
        )
      }
      <div className="w-full mx-auto">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-bold text-white mb-3">
            All your trips
          </h2>
          <button
            onClick={() => setAddTripModalOpen(true)}
            className="inline-block py-2 text-white px-6 md:text-lg bg-primary-800 hover:bg-primary-600 rounded mr-2"
          >
            Create new plan
          </button>
        </div>
        {tripPreviews.length > 0 ? (
          <div className="my-5">
            <TripsDashboard trips={tripPreviews} />
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-white/70">
                You haven't created any trips yet.
            </p>
            <p className="mt-2 text-sm text-white/50">
                When you create trips, they will appear here for you to manage and view.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}