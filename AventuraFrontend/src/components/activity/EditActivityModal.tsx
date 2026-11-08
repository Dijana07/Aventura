import { useState } from "react";
import { Input } from "@/components/tailgrids/core/input";
import { Label } from "@/components/tailgrids/core/label";
import type { ActivityDto } from "@/models/activity/ActivityDto";
import type { UpdateActivityRequest } from "@/models/activity/UpdateActivityRequest";
import { activityService } from "@/services/activityService";
import { ActivityStatus } from "@/enums/ActivityStatus";
import { validateUpdateActivity } from "@/validators/activityValidator";

interface Props {
  tripId: string;
  activity: ActivityDto;
  onActivityUpdated?: (
    activity: ActivityDto
  ) => void;
}

export default function EditActivityModal({ tripId, activity, onActivityUpdated }: Props) {
  const [title, setTitle] = useState(activity.title);
  const [location, setLocation] = useState(activity.location);
  const [description, setDescription] = useState(activity.description);
  const [budget, setBudget] = useState(activity.budget.toString());
  const [startDateTime, setStartDateTime] = useState(activity.startDateTime.slice(0, 16));
  const [endDateTime, setEndDateTime] = useState(activity.endDateTime.slice(0, 16));
  const [activityStatus, setActivityStatus] = useState(activity.activityStatus);
  const [notes, setNotes] = useState(activity.notes ?? "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const request: UpdateActivityRequest =
        {
          activityId: activity.id,
          tripId,

          title:
            title === activity.title
              ? undefined
              : title,

          location:
            location === activity.location
              ? undefined
              : location,

          description:
            description ===
            activity.description
              ? undefined
              : description,

          budget:
            Number(budget) ===
            activity.budget
              ? undefined
              : Number(budget),

          startDate:
            startDateTime ===
            activity.startDateTime.slice(
              0,
              16
            )
              ? undefined
              : startDateTime,

          endDate:
            endDateTime ===
            activity.endDateTime.slice(
              0,
              16
            )
              ? undefined
              : endDateTime,

          activityStatus:
            activityStatus ===
            activity.activityStatus
              ? undefined
              : activityStatus,

          notes:
            notes === activity.notes
              ? undefined
              : notes,
        };

      const error = validateUpdateActivity(request);
      if (error)
      {
        setIsLoading(false);
        alert(error);
        return;
      }

      const result = await activityService.updateActivity(request);

      if (result.success && result.data) {
        onActivityUpdated?.(result.data);
        alert("Activity updated successfully");
      } else {
        alert("Failed to update activity. " +result.message);
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
        Edit activity
      </h2>

      <div className="space-y-3 md:space-y-5">
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
              setLocation(
                e.target.value
              )
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

        <div className="grid gap-3 md:gap-5 md:grid-cols-2">
          <div className="grid gap-2">
            <Label className="text-white">
              Start
            </Label>
            <Input
              type="datetime-local"
              value={startDateTime}
              className="bg-transparent"
              onChange={(e) =>
                setStartDateTime(
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
              value={endDateTime}
              className="bg-transparent"
              onChange={(e) =>
                setEndDateTime(
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
          <div className="grid gap-2">
            <Label className="text-white">
              Status
            </Label>
            <select
              value={activityStatus}
              onChange={(e) =>
                setActivityStatus(
                  e.target
                    .value as keyof typeof ActivityStatus
                )
              }
              className="rounded-xl border border-white/20 bg-transparent px-4 py-3 text-white"
            >
              {Object.values(
                ActivityStatus
              ).map((status) => (
                <option
                  key={status}
                  value={status}
                  className="bg-background-100"
                >
                  {status}
                </option>
              ))}
            </select>
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
          { isLoading ? "Saving changes..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}