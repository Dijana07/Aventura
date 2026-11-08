import { useState } from "react";
import { Input } from "@/components/tailgrids/core/input";
import { Label } from "@/components/tailgrids/core/label";
import type { UpdateTripRequest } from "@/models/trip/UpdateTripRequest";
import type { TripDto } from "@/models/trip/TripDto";
import { tripService } from "@/services/tripService";
import { validateUpdateTrip } from "@/validators/tripValidator";

interface Props {
  trip: TripDto;
  onTripUpdated?: (trip: TripDto) => void;
}

export default function EditTripModal({
  trip,
  onTripUpdated,
}: Props) {
  const [title, setTitle] = useState(trip.title);
  const [startDate, setStartDate] = useState(trip.startDate.split("T")[0]);
  const [endDate, setEndDate] = useState(trip.endDate.split("T")[0]);
  const [budget, setBudget] = useState(trip.budget?.toString() ?? "");
  const [notes, setNotes] = useState(trip.notes ?? "");
  const [image, setImage] = useState<File>();
  const [imagePreview, setImagePreview] = useState(trip.photoUrl ?? "");
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const request: UpdateTripRequest = {
        tripId: trip.id,
        title:
          title === trip.title ? undefined : title,
        startDate: startDate === trip.startDate.split("T")[0] ? undefined : startDate,
        endDate: endDate === trip.endDate.split("T")[0] ? undefined : endDate,
        budget: Number(budget) === trip.budget ? undefined: Number(budget),
        notes: notes === trip.notes ? undefined : notes,
        image,
      };

      const error = validateUpdateTrip(request);
      if (error)
      {
        setIsLoading(false);
        alert(error);
        return;
      }

      const result = await tripService.updateTrip(request);

      if (result.success && result.data) {
        onTripUpdated?.(result.data);
        alert("Trip updated successfully");
      } else {
        alert(
          "Failed to update trip: " +
            result.message
        );
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
      <h2 className="mb-8 text-2xl font-semibold text-white">
        Edit trip
      </h2>

      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        <div className="flex flex-col items-center">
          <img
            src={imagePreview}
            alt="Trip"
            className="h-64 w-full rounded-xl border border-white/20 object-cover"
          />

          <label className="mt-4 cursor-pointer rounded-xl bg-green-700 px-4 py-2 text-white transition hover:bg-green-800">
            Upload new photo

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        <div className="space-y-5">
          <div className="grid gap-2">
            <Label className="text-white">
              Title
            </Label>

            <Input
              value={title}
              className="bg-transparent"
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
              <Label className="text-white">
                Start date
              </Label>

              <Input
                type="date"
                value={startDate}
                className="bg-transparent"
                onChange={(e) =>
                  setStartDate(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-white">
                End date
              </Label>

              <Input
                type="date"
                value={endDate}
                className="bg-transparent"
                onChange={(e) =>
                  setEndDate(
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="text-white">
              Budget
            </Label>

            <Input
              type="number"
              value={budget}
              className="bg-transparent"
              onChange={(e) =>
                setBudget(
                  e.target.value
                )
              }
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-white">
              Notes
            </Label>

            <textarea
              rows={5}
              value={notes}
              onChange={(e) =>
                setNotes(
                  e.target.value
                )
              }
              className="rounded-xl border border-white/20 bg-transparent px-4 py-3 text-white"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={handleSave}
          disabled={isLoading}
          className="rounded-xl bg-green-700 px-8 py-3 font-medium text-white transition hover:bg-green-800"
        >
          { isLoading ? "Saving changes..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}