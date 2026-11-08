import { Avatar } from "@/components/tailgrids/core/avatar";
import { Button } from "../tailgrids/core/button";
import { List } from "@/components/tailgrids/core/list";
import type { TripPreviewDto } from "@/models/trip/TripPreviewDto";
import { useNavigate } from "react-router-dom";

interface Props {
  trips: TripPreviewDto[];
}

export default function TripsDashboard({ trips }: Props) {
  const navigate = useNavigate();
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
      <List className="w-window!">
        {trips.map((trip) => (
          <li
            key={trip.id}
            className="flex w-full h-20 items-center justify-between gap-4 py-3"
          >
            <div className="flex items-center gap-3">
              <Avatar
                src={trip.photoUrl}
                alt={trip.title}
                fallback={trip.title.charAt(0)}
                size="xl"
              />

              <div className="flex flex-col">
                <span className="font-medium text-lg text-title-50">
                  {trip.title}
                </span>
                <span className="text-sm text-text-200">
                  {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  navigate(`/trip/${trip.id}`);
                }}
                className="bg-primary-700 hover:bg-primary-500 text-white"
              >
                View details
              </Button>
            </div>
          </li>
        ))}
      </List>
  );
}