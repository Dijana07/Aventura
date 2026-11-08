import type { ActivityDto } from "@/models/activity/ActivityDto";
import { Pencil, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "../tailgrids/core/alert-dialog";
import { buttonStyles } from "../tailgrids/core/button";
import { activityService } from "@/services/activityService";

interface Props {
  tripId: string;
  activity: ActivityDto;
  onEdit: (activity: ActivityDto) => void;
  onDelete: (activityId: string) => void;
  canEdit: boolean;
}

export default function ActivityCard({
  tripId,
  activity,
  onEdit,
  onDelete,
  canEdit,
}: Props) {
  const handleDelete = async (item: ActivityDto) => {
    try {
      const result = await activityService.deleteActivity({activityId: item.id, tripId});

      if (result.success)
      {
        onDelete(item.id);
      }
      else
      {
        alert(result.message);
      }
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-background-100 p-4 min-h-[180px] flex flex-col">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-white">
          {activity.title}
        </h3>

        <p className="mt-1 text-sm text-gray-400">
          {activity.location}
        </p>

        <p className="mt-1 text-sm text-gray-400">
          {new Date(activity.startDateTime).toLocaleString()}
        </p>

        <p className="mt-1 text-sm text-gray-400">
          {activity.budget} €
        </p>

        <p className="mt-2 text-sm text-green-400">
          {activity.activityStatus}
        </p>
      </div>

      {canEdit && (
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => onEdit(activity)}
            className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700"
          >
            <Pencil size={18} />
          </button>

          <AlertDialog>
            <AlertDialogTrigger className="rounded-lg bg-red-600! p-2 text-white hover:bg-red-700!">
              <Trash2 size={18} />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete activity</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this activity? This action is
                  permanent and all related data will be lost.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className={buttonStyles({ variant: "danger", size: "sm" })}
                  onClick={() => handleDelete(activity)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}