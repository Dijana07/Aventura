import type { DestinationDto } from "@/models/destination/DestinationDto";
import DestinationCard from "./DestinationCard";

interface Props {
  tripId: string;
  destinations: DestinationDto[];
  onEdit: (destination: DestinationDto) => void;
  onDelete: (destinationId: string) => void;
  canEdit: boolean;
}

export default function DestinationDashboard({
  tripId,
  destinations,
  onEdit,
  onDelete,
  canEdit,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 justify-start! w-full!">
      {destinations.map((destination) => (
        <DestinationCard
          tripId={tripId}
          key={destination.id}
          destination={destination}
          onEdit={onEdit}
          onDelete={onDelete}
          canEdit={canEdit}
        />
      ))}
    </div>
  );
}