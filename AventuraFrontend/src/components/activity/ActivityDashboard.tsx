import type { ActivityDto } from "@/models/activity/ActivityDto";
import ActivityCard from "./ActivityCard";

interface Props {
  tripId: string;
  activities: ActivityDto[];
  onEdit: (activity: ActivityDto) => void;
  onDelete: (activityId: string) => void;
  canEdit: boolean;
}

export default function ActivityDashboard({
  tripId,
  activities,
  onEdit,
  onDelete,
  canEdit,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 justify-start! w-full!">
      {activities.map((activity) => (
        <ActivityCard
          tripId={tripId}
          key={activity.id}
          activity={activity}
          onEdit={onEdit}
          onDelete={onDelete}
          canEdit={canEdit}
        />
      ))}
    </div>
  );
}