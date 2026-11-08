import { useState } from "react";
import { Input } from "@/components/tailgrids/core/input";
import { Label } from "@/components/tailgrids/core/label";
import { destinationService } from "@/services/destinationService";
import type { DestinationDto } from "@/models/destination/DestinationDto";
import type { CreateDestinationRequest } from "@/models/destination/CreateDestinationRequest";
import { validateCreateDestination } from "@/validators/destinationValidator";

interface Props {
  tripId: string;
  onDestinationCreated?: (
    destination: DestinationDto
  ) => void;
}

export default function AddDestinationModal({ tripId, onDestinationCreated }: Props) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const request: CreateDestinationRequest =
        {
          tripId,
          title,
          location,
          startDate,
          endDate,
          notes: notes || undefined,
        };

      const error = validateCreateDestination(request);
      if (error)
      {
        setIsLoading(false);
        alert(error);
        return;
      }
      const result = await destinationService.createDestnation(request);

      if (result.success && result.data) {
        onDestinationCreated?.(result.data);

        setTitle("");
        setLocation("");
        setStartDate("");
        setEndDate("");
        setNotes("");

        alert("Destination created successfully");
      } else {
        alert("Failed to create destination. " + result.message);
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
        Add destination
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
              setNotes(
                e.target.value
              )
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
          { isLoading ? "Adding destination..." : "Add destination"}
        </button>
      </div>
    </div>
  );
}