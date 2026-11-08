import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import type { ActivityDto } from "@/models/activity/ActivityDto";

interface Props {
  activities: ActivityDto[];
  tripStartDate: string;
  tripEndDate: string;
  onEdit: (activity: ActivityDto) => void;
  canEdit: boolean;
}

export default function ActivitiesCalendar({ activities, tripStartDate, tripEndDate, onEdit, canEdit, }: Props) {
  const isMobile = window.innerWidth < 768;
  const validEnd = new Date(tripEndDate);
  validEnd.setDate(validEnd.getDate() + 1);

  const tripDurationDays =
    Math.ceil(
      (new Date(tripEndDate).getTime() -
        new Date(tripStartDate).getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1;

  return (
    <div className="w-full rounded-xl bg-background-100 p-4">
      <FullCalendar
        plugins={[
          timeGridPlugin,
          interactionPlugin,
          dayGridPlugin,
        ]}
        views={{
          tripView: {
            type: "timeGridWeek",
            duration: {
              days: tripDurationDays,
            },
          },
        }}
        initialView={
          isMobile
            ? "timeGridDay"
            : "tripView"
        }
        initialDate={tripStartDate}

        height="880px"

        allDaySlot={false}
        slotMinTime="06:00:00"
        slotMaxTime="23:00:00"

        nowIndicator={false}
        editable={false}

        headerToolbar={
          isMobile
            ? {
                left: "prev",
                center: "title",
                right: "next",
              }
            : false
        }
         validRange={{
          start: tripStartDate,
          end: validEnd.toISOString(),
        }}
        eventClick={(info) => {
          if (canEdit){
            const activity =
              activities.find(
                (a) =>
                  a.id === info.event.id
              );

            if (activity) {
              onEdit(activity);
            }
          }
        }}
        titleFormat={{
          day: "numeric",
          month: "short",
        }}
        events={activities.map(
          (activity) => ({
            id: activity.id,
            title: activity.title,
            start:
              activity.startDateTime,
            end:
              activity.endDateTime,

            backgroundColor:
              activity.activityStatus ===
              "DONE"
                ? "#16a34a"
                : activity.activityStatus ===
                  "RESERVED"
                ? "#2563eb"
                : activity.activityStatus ===
                  "CANCELLED"
                ? "#dc2626"
                : "#f59e0b",
          })
        )}
      />
    </div>
  );
}