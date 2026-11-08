import { tripService } from "@/services/tripService";
import { validateCreateTrip } from "@/validators/tripValidator";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddTripModal() {
    const [tripData, setTripData] = useState({
        title: "",
        startDate: "",
        endDate: "",
        budget: 0,
        notes: "",
    });
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        setIsLoading(true);
        e.preventDefault();

        try {
            const error = validateCreateTrip(tripData);
            if (error)
            {
                setIsLoading(false);
                alert(error);
                return;
            }

            const result = await tripService.createTrip(tripData);

            if (result.success) {
                alert("Trip created successfully!");
                navigate(`/trip/${result.data?.id}`);
            } else {
                alert("Failed to create trip: " + result.message);
            }
        } catch (error) {
            alert(
                error instanceof Error
                ? error.message
                : "Something went wrong"
            );
        } finally {
           setIsLoading(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-5xl max-h-[90dvh] md:max-h-[95dvh] overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Create New Trip</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                    type="text"
                    className="w-full border bg-transparent border-gray-300 rounded px-3 py-2"
                    value={tripData.title}
                    onChange={(e) => setTripData({ ...tripData, title: e.target.value })}
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                    type="date"
                    className="w-full border bg-transparent border-gray-300 rounded px-3 py-2"
                    value={tripData.startDate}
                    onChange={(e) => setTripData({ ...tripData, startDate: e.target.value })}
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                    type="date"
                    className="w-full border bg-transparent border-gray-300 rounded px-3 py-2"
                    value={tripData.endDate}
                    onChange={(e) => setTripData({ ...tripData, endDate: e.target.value })}
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Budget</label>
                <input
                    type="number"
                    className="w-full border bg-transparent border-gray-300 rounded px-3 py-2"
                    value={tripData.budget}
                    onChange={(e) => setTripData({ ...tripData, budget: parseFloat(e.target.value) })}
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                    className="w-full border bg-transparent border-gray-300 rounded px-3 py-2"
                    value={tripData.notes}
                    onChange={(e) => setTripData({ ...tripData, notes: e.target.value })}
                />
            </div>
            <button
                type="submit"
                className="px-4 py-2 bg-primary-900 text-white rounded hover:bg-primary-500"
                disabled={isLoading}
            >
                {isLoading
                ? "Creating..."
                : "Create trip"}
            </button>
        </form>
        </div>
    );
}