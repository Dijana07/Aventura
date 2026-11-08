import { useState } from "react";
import { Input } from "@/components/tailgrids/core/input";
import { Label } from "@/components/tailgrids/core/label";
import { activityService } from "@/services/activityService";
import type { ActivityDto } from "@/models/activity/ActivityDto";
import type { CreateActivityRequest } from "@/models/activity/CreateActivityRequest";
import { validateCreateActivity } from "@/validators/activityValidator";

interface Props {
  tripId: string;
  onActivityCreated?: (
    activity: ActivityDto
  ) => void;
}

export default function AddActivityModal({ tripId, onActivityCreated }: Props) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const request: CreateActivityRequest = {
        tripId,
        title,
        startDate,
        endDate,
        location,
        description,
        budget: Number(budget),
        notes: notes || undefined,
      };

      const error = validateCreateActivity(request);
      if (error)
      {
        setIsLoading(false);
        alert(error);
        return;
      }

      const result = await activityService.createActivity(request);

      if (result.success && result.data) {
        onActivityCreated?.(result.data);

        setTitle("");
        setLocation("");
        setDescription("");
        setBudget("");
        setStartDate("");
        setEndDate("");
        setNotes("");

        alert("Activity created successfully");
      } else {
        alert("Failed to create activity. " +result.message);
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
        Add activity
      </h2>

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

        <div className="grid gap-2">
          <Label className="text-white">
            Location
          </Label>

          <Input
            value={location}
            className="bg-transparent"
            onChange={(e) =>
              setLocation(e.target.value)
            }
          />
        </div>

        <div className="grid gap-2">
          <Label className="text-white">
            Description
          </Label>

          <textarea
            rows={1}
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            className="rounded-xl border border-white/20 bg-transparent px-4 py-3 text-white"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="grid gap-2">
            <Label className="text-white">
              Start
            </Label>

            <Input
              type="datetime-local"
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
              End
            </Label>

            <Input
              type="datetime-local"
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

        <div className="grid gap-5 md:grid-cols-2">
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
        </div>

        <div className="grid gap-2">
          <Label className="text-white">
            Notes
          </Label>

          <textarea
            rows={1}
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
          { isLoading ? "Adding activity..." : "Add activity"}
        </button>
      </div>
    </div>
  );
}