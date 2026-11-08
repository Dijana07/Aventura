import { useState } from "react";
import { Input } from "@/components/tailgrids/core/input";
import { Label } from "@/components/tailgrids/core/label";
import type { DestinationDto } from "@/models/destination/DestinationDto";
import type { UpdateDestinationRequest } from "@/models/destination/UpdateDestinationRequest";
import { destinationService } from "@/services/destinationService";
import { validateUpdateDestination } from "@/validators/destinationValidator";

interface Props {
  tripId: string;
  destination: DestinationDto;
  onDestinationUpdated?: (
    destination: DestinationDto
  ) => void;
}

export default function EditDestinationModal({tripId, destination, onDestinationUpdated}: Props) {
  const [title, setTitle] = useState(destination.title);
  const [location, setLocation] = useState(destination.location);
  const [startDate, setStartDate] = useState(destination.startDate.split("T")[0]);
  const [endDate, setEndDate] = useState(destination.endDate.split("T")[0]);
  const [notes, setNotes] = useState(destination.notes ?? "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const request: UpdateDestinationRequest = {
        destinationId: destination.id,
        tripId: tripId,
        title:
          title === destination.title
            ? undefined
            : title,

        location:
          location === destination.location
            ? undefined
            : location,

        startDate:
          startDate ===
          destination.startDate.split("T")[0]
            ? undefined
            : startDate,

        endDate:
          endDate ===
          destination.endDate.split("T")[0]
            ? undefined
            : endDate,

        notes:
          notes === destination.notes
            ? undefined
            : notes,
      };

      const error = validateUpdateDestination(request);
      if (error)
      {
        setIsLoading(false);
        alert(error);
        return;
      }

      const result = await destinationService.updateDestination(request);

      if (result.success && result.data) {
        onDestinationUpdated?.(result.data);
        alert("Destination updated successfully");
      } else {
        alert("Failed to update destination. " +result.message);
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
      <h2 className="mb-6 text-2xl font-semibold text-white">
        Edit destination
      </h2>

      <div className="space-y-5">
        <div className="grid gap-2">
          <Label className="text-white">
            Title
          </Label>

          <Input
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="bg-transparent"
          />
        </div>

        <div className="grid gap-2">
          <Label className="text-white">
            Location
          </Label>

          <Input
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
            className="bg-transparent"
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
              onChange={(e) =>
                setStartDate(
                  e.target.value
                )
              }
              className="bg-transparent"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-white">
              End date
            </Label>

            <Input
              type="date"
              value={endDate}
              onChange={(e) =>
                setEndDate(
                  e.target.value
                )
              }
              className="bg-transparent"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label className="text-white">
            Notes
          </Label>

          <textarea
            rows={5}
            value={notes}
            onChange={(e) =>
              setNotes(e.target.value)
            }
            className="rounded-xl border border-white/20 bg-transparent px-4 py-3 text-white"
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isLoading}
          className="rounded-xl bg-green-700 px-6 py-3 text-white hover:bg-green-800"
        >
          { isLoading ? "Saving changes..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}