import TripsDashboard from "@/components/trip/TripsDashboard";
import AppLayout from "@/layout/AppLayout";
import type { TripPreviewDto } from "@/models/trip/TripPreviewDto";
import { tripService } from "@/services/tripService";
import { useEffect, useState } from "react";
import AddTripModal from "../../components/trip/AddTripModal";

export default function HomePage() {
  const [tripPreviews, setTripPreviews] = useState<TripPreviewDto[]>([]); 
  const [addTripModalOpen, setAddTripModalOpen] = useState(false);
  
  useEffect(() => {
    const fetchTripPreviews = async () => {
      const result = await tripService.getLastThreeTripsPreviews();
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
      <div className="md:flex justify-between p-10 no-repeat bg-cover bg-center mb-10 rounded-xl"
          style={{
            backgroundImage: "url('/background.jpg')",
          }}>
        <div className="md:w-1/2 mb-10 md:mb-0 text-primary-900">
            <h3 className="text-3xl line-through mb-2">Sadness?</h3>
            <h3 className="text-3xl line-through mb-2">Boredom?</h3>
            <h3 className="text-3xl line-through mb-4">No motivation?</h3>
            <h2 className="text-5xl font-bold mb-8">Travelling.</h2>
            <p className="mb-10">There is never a sad day travelling.</p>
            <button
              onClick={() => setAddTripModalOpen(true)}
              className="inline-block py-2 text-white px-6 md:text-lg bg-primary-800 hover:bg-primary-600 rounded mr-2"
            >
              Create new plan
            </button>
        </div>
      </div>
      <div className="w-full mx-auto">
        {tripPreviews.length > 0 ? (
          <div className="my-5">
            <h2 className="text-2xl font-bold text-white mb-3">
              Most recent trips
            </h2>
            <TripsDashboard trips={tripPreviews} />
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-white/70">
              You don't have any trips yet.
            </p>
            <p className="mt-2 text-sm text-white/50">
              Create your first trip to start planning destinations,
              activities, expenses, and packing lists.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}