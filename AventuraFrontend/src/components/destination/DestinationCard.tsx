import type { DestinationDto } from "@/models/destination/DestinationDto";
import { Pencil, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../tailgrids/core/alert-dialog";
import { buttonStyles } from "../tailgrids/core/button";
import { destinationService } from "@/services/destinationService";

interface Props {
  tripId: string;
  destination: DestinationDto;
  onEdit: (destination: DestinationDto) => void;
  onDelete: (destinationId: string) => void;
  canEdit: boolean;
}

export default function DestinationCard({
  tripId,
  destination,
  onEdit,
  onDelete,
  canEdit,
}: Props) {
  const handleDelete = async (item: DestinationDto) => {
    try {
      const result = await destinationService.deleteDestination({destinationId: item.id, tripId});

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
          {destination.title}
        </h3>

        <p className="mt-1 text-sm text-gray-400">
          {destination.location}
        </p>

        <p className="mt-1 text-sm text-gray-400">
          {new Date(destination.startDate).toLocaleDateString()}
          {" - "}
          {new Date(destination.endDate).toLocaleDateString()}
        </p>
      </div>

      {canEdit && (
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => onEdit(destination)}
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
                <AlertDialogTitle>Delete destination</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this destination? This action is
                  permanent and all related data will be lost.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className={buttonStyles({ variant: "danger", size: "sm" })}
                  onClick={() => handleDelete(destination)}
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