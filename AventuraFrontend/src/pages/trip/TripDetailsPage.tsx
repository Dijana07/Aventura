import { Button, buttonStyles } from "@/components/tailgrids/core/button";
import { Spinner } from "@/core/spinner";
import AppLayout from "@/layout/AppLayout";
import type { TripDto } from "@/models/trip/TripDto";
import { tripService } from "@/services/tripService";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil, Plus, Download, ListChecks, Share2, Trash2 } from "lucide-react";
import EditTripModal from "@/components/trip/EditTripModal";
import type { DestinationDto } from "@/models/destination/DestinationDto";
import EditDestinationModal from "@/components/destination/EditDestinationModal";
import DestinationDashboard from "@/components/destination/DestinationDashboard";
import AddDestinationModal from "@/components/destination/AddDestinationModal";
import type { ActivityDto } from "@/models/activity/ActivityDto";
import EditActivityModal from "@/components/activity/EditActivityModal";
import AddActivityModal from "@/components/activity/AddActivityModal";
import ActivityDashboard from "@/components/activity/ActivityDashboard";
import ActivitiesCalendar from "@/components/activity/ActivitiesCalendar";
import type { ExpenseDto } from "@/models/expense/ExpenseDto";
import { expenseService } from "@/services/expenseService";
import ExpenseDashboard from "@/components/expense/ExpenseDashboard";
import CategorizedExpenses from "@/components/expense/CategorizedExpenses";
import EditExpenseModal from "@/components/expense/EditExpenseModal";
import AddExpenseModal from "@/components/expense/AddExpenseModal";
import { downloadTripReport } from "@/helpers/tripReportHelper";
import Checklist from "@/components/trip/Checklist";
import GenerateShareTokenModal from "@/components/trip/GenerateShareTokenModal";
import { useAuth } from "@/contexts/AuthContext";
import type { ChecklistItemDto } from "@/models/trip/ChecklistItemDto";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/tailgrids/core/alert-dialog";

export default function TripDetailsPage() {
  const [tripDetails, setTripDetails] = useState<TripDto | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [destinations, setDestinations] = useState<DestinationDto[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<DestinationDto | null>(null);
  const [isAddDestinationOpen, setIsAddDestinationOpen] = useState(false);
  const [activities, setActivities] = useState<ActivityDto[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<ActivityDto | null>(null);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [activityView, setActivityView] = useState<"list" | "calendar">("list");
  const budgetLeft = tripDetails ? tripDetails.budget - tripDetails.totalExpenses : 0;
  const [budget, setBudget] = useState(budgetLeft);
  const [expenses, setExpenses] = useState<ExpenseDto[]>([]);
  const [expenseView, setExpenseView] = useState<"list" | "categories">("list");
  const [selectedExpense, setSelectedExpense] = useState<ExpenseDto | null>(null);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [checklistItems, setChecklistItems] = useState<ChecklistItemDto[]>([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { id, token } = useParams<{ id: string, token: string }>();
  const navigate = useNavigate();

  const handleDelete = async (item: TripDto) => {
    try {
      const result = await tripService.deleteTrip(item.id);

      alert(result.message);
      if (result.success)
      {
        navigate("/home");
      }
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    }
  };

  const calculateBudget = () => {
    if (!tripDetails) return;
    let left = tripDetails.budget;
    left -= activities.filter(a => a.activityStatus !== "CANCELLED").reduce((sum, a) => sum + a.budget, 0);
    left -= expenses.reduce((sum, e) => sum + e.amount, 0);

    setBudget(left);
  }

  useEffect(() => {
    calculateBudget();
  }, [expenses, activities]);

  useEffect(() => {
    if (id) {
      loadTripById();
    }

    else if (token) {
      loadTripByToken();
    }
  }, [id, token]);

  useEffect(() => {
    //console.log(tripDetails);
    fetchExpenses();
  }, [tripDetails])

  useEffect(() => {
    if (tripDetails?.canEdit && !isAuthenticated)
      navigate("/");
  }, [id, token]);

  const fetchExpenses = async () => {
    if (!tripDetails) return;

    const result = await expenseService.getAllExpensesByTripId(tripDetails.id);

    if (result.success && result.data) {
      setExpenses(result.data);
    }
  };

  const loadTripById = async () => {
    if (!id) return;
    try {
      const result = await tripService.getTripDetails(id);

      if (result.success && result.data) {
        setTripDetails(result.data);
        setDestinations(result.data.destinations);
        setActivities(result.data.activities);
        setChecklistItems(result.data.checklistItems);
      }
      else {
        alert(result.message);
      }
    } catch (error)
    {
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
      if (user === null)
        navigate("/");

      navigate("/home")
    }
  };

  const loadTripByToken = async () => {
    if (!token) return;
    try {
      const result = await tripService.getTripByToken(token);

      if (result.success && result.data) {
        setTripDetails(result.data);
        setDestinations(result.data.destinations);
        setActivities(result.data.activities);
        setChecklistItems(result.data.checklistItems);
      }
      else {
        alert(result.message);
      }
    } catch (error)
    {
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
      if (user === null)
        navigate("/");

      navigate("/home")
    }
  };

  return (
    <AppLayout>
      {!tripDetails ? (
        <div className="flex h-screen items-center justify-center">
          <Button disabled className="bg-background-100">
            <Spinner size="sm" />
            Loading...
          </Button>
        </div>
      ) : (
        <>
        {
          isEditOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="relative rounded-lg bg-background-100 p-6">
                <button
                  onClick={() =>
                    setIsEditOpen(false)
                  }
                  className="absolute right-4 top-2 text-2xl md:text-4xl text-white"
                >
                  &times;
                </button>

                <EditTripModal
                  trip={tripDetails}
                  onTripUpdated={(updatedTrip) => {
                    setTripDetails(updatedTrip);
                    setIsEditOpen(false);
                  }}
                />                
              </div>
            </div>
          )
        }
        {
          selectedDestination && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="relative w-[95vw] max-w-2xl rounded-lg bg-background-100 p-4 md:p-6 max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() =>
                    setSelectedDestination(null)
                  }
                  className="absolute right-2 top-2 mr-2 text-4xl text-white"
                >
                  &times;
                </button>

                <EditDestinationModal
                  tripId={tripDetails.id}
                  destination={selectedDestination}
                  onDestinationUpdated={(
                    updatedDestination
                  ) => {
                    setDestinations((prev) =>
                      prev.map((d) =>
                        d.id === updatedDestination.id
                          ? updatedDestination
                          : d
                      )
                    );

                    setSelectedDestination(null);
                  }}
                />
              </div>
            </div>
          )
        }
        {
          isAddDestinationOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="relative rounded-lg bg-background-100 p-6">
                <button
                  onClick={() =>
                    setIsAddDestinationOpen(false)
                  }
                  className="absolute right-4 top-2 text-2xl md:text-4xl text-white"
                >
                  &times;
                </button>

                <AddDestinationModal
                  tripId={tripDetails.id}
                  onDestinationCreated={(
                    destination
                  ) => {
                    setDestinations((prev) => [
                      ...prev,
                      destination,
                    ]);

                    setIsAddDestinationOpen(false);
                  }}
                />
              </div>
            </div>
          )
        }
        {
          selectedActivity && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4">
              <div className="relative mx-auto my-4 w-[95vw] max-w-2xl rounded-lg bg-background-100 p-4 md:p-6 ">
                <button
                  onClick={() =>
                    setSelectedActivity(null)
                  }
                  className="absolute right-2 top-2 mr-2 text-2xl md:text-4xl text-white"
                >
                  &times;
                </button>

                <EditActivityModal
                  tripId={tripDetails.id}
                  activity={selectedActivity}
                  onActivityUpdated={(
                    updatedActivity
                  ) => {
                    setActivities((prev) =>
                      prev.map((a) =>
                        a.id === updatedActivity.id
                          ? updatedActivity
                          : a
                      )
                    );

                    setSelectedActivity(null);
                  }}
                />
              </div>
            </div>
          )
        }
        {
          isAddActivityOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="relative rounded-lg bg-background-100 p-6">
                <button
                  onClick={() =>
                    setIsAddActivityOpen(false)
                  }
                  className="absolute right-4 top-2 text-2xl md:text-4xl text-white"
                >
                  &times;
                </button>

                <AddActivityModal
                  tripId={tripDetails.id}
                  onActivityCreated={(
                    activity
                  ) => {
                    setActivities((prev) => [
                      ...prev,
                      activity,
                    ]);

                    setIsAddActivityOpen(false);
                  }}
                />
              </div>
            </div>
          )
        }
        {
          selectedExpense && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-background-100 relative rounded-lg p-6">
                <button
                  onClick={() =>
                    setSelectedExpense(null)
                  }
                  className="absolute right-2 top-2 mr-2 text-2xl md:text-4xl text-white"
                >
                  &times;
                </button>

                <EditExpenseModal
                  tripId={tripDetails.id}
                  expense={selectedExpense}
                  onExpenseUpdated={(
                    updatedExpense
                  ) => {
                    setExpenses((prev) =>
                      prev.map((e) =>
                        e.id === updatedExpense.id
                          ? updatedExpense
                          : e
                      )
                    );

                    setSelectedExpense(null);
                  }}
                />
              </div>
            </div>
          )
        }
        {
          isAddExpenseOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="relative rounded-lg bg-background-100 p-6">
                <button
                  onClick={() =>
                    setIsAddExpenseOpen(false)
                  }
                  className="absolute right-4 top-2 text-2xl md:text-4xl text-white"
                >
                  &times;
                </button>

                <AddExpenseModal
                  tripId={tripDetails.id}
                  onExpenseCreated={(
                    expense
                  ) => {
                    setExpenses((prev) => [
                      ...prev,
                      expense,
                    ]);

                    setIsAddExpenseOpen(false);
                  }}
                />
              </div>
            </div>
          )
        }
        {
          isChecklistOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="relative w-full max-w-2xl rounded-lg bg-background-100 p-6">
                <button
                  onClick={() => setIsChecklistOpen(false)}
                  className="absolute right-4 top-2 text-2xl md:text-4xl text-white"
                >
                  &times;
                </button>

                <h2 className="mb-6 text-2xl font-semibold text-white">
                  Checklist
                </h2>

                <Checklist
                  tripId={tripDetails.id}
                  checklistItems={checklistItems}
                  canEdit={tripDetails.canEdit}
                  onAdd={(
                    item
                  ) => {
                    setChecklistItems((prev) => [
                      ...prev,
                      item,
                    ]);
                  }}
                  onDelete={(itemId) => {
                    setChecklistItems((prev) =>
                      prev.filter((i) => i.id !== itemId)
                    );
                  }}
                  onItemUpdated={(
                    updatedItem
                  ) => {
                    setChecklistItems((prev) =>
                      prev.map((i) =>
                        i.id === updatedItem.id
                          ? updatedItem
                          : i
                      )
                    );
                  }}
                />
              </div>
            </div>
          )
        }

        {
          isShareModalOpen && (
            <GenerateShareTokenModal
              tripId={tripDetails.id}
              onClose={() =>
                setIsShareModalOpen(false)
              }
            />
          )
        }

        <div className="space-y-6">
          <div className="rounded-xl border border-white/10 bg-background-100 p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-white">
                  {tripDetails.title}
                </h1>

                <p className="mt-2 text-text-100">
                  {new Date(
                    tripDetails.startDate
                  ).toLocaleDateString()}
                  {" - "}
                  {new Date(
                    tripDetails.endDate
                  ).toLocaleDateString()}
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={() =>
                      downloadTripReport({
                        trip: tripDetails,
                        expenses,
                      })
                    }
                    className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-white hover:bg-green-800"
                  >
                    <Download size={18} />
                    Download Plan
                  </button>

                  <button
                    onClick={() =>
                      setIsChecklistOpen(true)
                    }
                    className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-blue-800"
                  >
                    <ListChecks size={18} />
                    Checklist
                  </button>

                  {tripDetails.canEdit && (
                    <button
                      onClick={() =>
                        setIsShareModalOpen(true)
                      }
                      className="flex items-center gap-2 rounded-lgflex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-white hover:bg-emerald-800"
                    >
                      <Share2 size={18} />
                      Share
                    </button>
                  )}
                </div>
              </div>

              <div
                className={`w-full lg:w-auto rounded-xl px-6 py-4 ${
                  budget < 0
                    ? "bg-red-500/20 text-red-400"
                    : "bg-emerald-500/20 text-emerald-400"
                }`}
              >
                <p className="text-sm opacity-80">
                  Budget Left
                </p>

                <p className="text-3xl font-bold">
                  {budget.toFixed(2)} €
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white mt-4">
              Trip Overview
            </h2>

            {tripDetails.canEdit && (
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() =>
                    setIsEditOpen(true)
                  }
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
                      <AlertDialogTitle>Delete trip</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this trip? This action is
                        permanent and all related data will be lost.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className={buttonStyles({ variant: "danger", size: "sm" })}
                        onClick={() => handleDelete(tripDetails)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            <div>
              <img
                src={tripDetails.photoUrl}
                alt={tripDetails.title}
                className="h-72 w-full rounded-xl object-cover"
              />
            </div>

            <div className="relative rounded-xl border border-white/10 bg-background-100 p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">
                    Title
                  </p>
                  <p className="text-lg text-white">
                    {tripDetails.title}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">
                    Dates
                  </p>

                  <p className="text-white">
                    {new Date(
                      tripDetails.startDate
                    ).toLocaleDateString()}
                    {" - "}
                    {new Date(
                      tripDetails.endDate
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">
                    Budget
                  </p>

                  <p className="text-white">
                    {tripDetails.budget} €
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">
                    Notes
                  </p>

                  <p className="whitespace-pre-wrap text-white">
                    {tripDetails.notes ||
                      "No notes"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-background-100 p-6">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h2 className="text-2xl font-semibold text-white">
                Destinations
              </h2>

              {tripDetails.canEdit && (
                <button
                  onClick={() =>
                    setIsAddDestinationOpen(true)
                  }
                  className="flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-white hover:bg-green-800"
                >
                  <Plus size={18} />
                  Add Destination
                </button>
              )}
            </div>

            <div
              className={`flex py-10 items-center px-10 rounded-lg border border-dashed border-white/20 ${
                tripDetails.destinations.length === 0
                  ? "justify-center"
                  : "justify-start"
              }`}
            >
              {tripDetails.destinations.length === 0 ? (
                <h3 className="text-center">
                  No destinations yet.
                </h3>
              ) : (
                <DestinationDashboard
                  tripId={tripDetails.id}
                  destinations={destinations}
                  onEdit={(destination) =>
                    setSelectedDestination(destination)
                  }
                  onDelete={(destinationId) => {
                    setDestinations((prev) =>
                      prev.filter((d) => d.id !== destinationId)
                    );
                  }}
                  canEdit={tripDetails.canEdit}
                />
              )}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-background-100 p-6">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h2 className="text-2xl font-semibold text-white">
                Activities
              </h2>
              <div className="flex s:w-full overflow-hidden rounded-lg border border-white/20">
                <button
                  onClick={() =>
                    setActivityView("list")
                  }
                  className={`flex-1 px-4 py-2 text-center ${
                    activityView === "list"
                      ? "bg-green-700 text-white"
                      : "bg-transparent text-gray-400"
                  }`}
                >
                  List
                </button>

                <button
                  onClick={() =>
                    setActivityView(
                      "calendar"
                    )
                  }
                  className={`flex-1 px-4 py-2 text-center ${
                    activityView ===
                    "calendar"
                      ? "bg-green-700 text-white"
                      : "bg-transparent text-gray-400"
                  }`}
                >
                  Calendar
                </button>
              </div>  
              {tripDetails.canEdit && (
                <button
                  onClick={() =>
                    setIsAddActivityOpen(true)
                  }
                  className="flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-white hover:bg-green-800"
                >
                  <Plus size={18} />
                  Add Activity
                </button>
              )}
            </div>

            <div
              className={`flex py-10 items-center px-10 rounded-lg border border-dashed border-white/20 ${
                activities.length === 0
                  ? "justify-center"
                  : "justify-start"
              }`}
            >
              {activities.length === 0 ? (
                <h3 className="w-full text-center">
                  No activities yet.
                </h3>
              ) : activityView === "list" ? (
                <ActivityDashboard
                  tripId={tripDetails.id}
                  activities={activities}
                  onEdit={(activity) =>
                    setSelectedActivity(activity)
                  }
                  onDelete={(activityId) => {
                    setActivities((prev) =>
                      prev.filter(
                        (a) => a.id !== activityId
                      )
                    );
                  }}
                  canEdit={tripDetails.canEdit}
                />
              ) : (
                <ActivitiesCalendar
                  activities={activities}
                  tripStartDate={tripDetails.startDate}
                  tripEndDate={tripDetails.endDate}
                  onEdit={(activity) =>
                    setSelectedActivity(activity)
                  }
                  canEdit={tripDetails.canEdit}
                />
              )}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-background-100 p-6">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h2 className="text-2xl font-semibold text-white">
                Expenses
              </h2>
              <div className="flex s:w-full overflow-hidden rounded-lg border border-white/20">
                <button
                  onClick={() =>
                    setExpenseView("list")
                  }
                  className={`flex-1 px-4 py-2 text-center ${
                    expenseView === "list"
                      ? "bg-green-700 text-white"
                      : "bg-transparent text-gray-400"
                  }`}
                >
                  List
                </button>

                <button
                  onClick={() =>
                    setExpenseView(
                      "categories"
                    )
                  }
                  className={`flex-1 px-4 py-2 text-center ${
                    expenseView ===
                    "categories"
                      ? "bg-green-700 text-white"
                      : "bg-transparent text-gray-400"
                  }`}
                >
                  Categories
                </button>
              </div> 
              {tripDetails.canEdit && ( 
                <button
                  onClick={() =>
                    setIsAddExpenseOpen(true)
                  }
                  className="flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-white hover:bg-green-800"
                >
                  <Plus size={18} />
                  Add Expense
                </button>
              )}
            </div>

            <div
              className={`flex py-10 items-center px-10 rounded-lg border border-dashed border-white/20 ${
                expenses.length === 0
                  ? "justify-center"
                  : "justify-start"
              }`}
            >
            {expenses.length === 0 ? (
                <h3 className="w-full text-center">
                  No expenses yet.
                </h3>
              ): expenseView === "list" ? (
                <ExpenseDashboard
                  tripId={tripDetails.id}
                  expenses={expenses}
                  onEdit={(expense) =>
                    setSelectedExpense(expense)
                  }
                  onDelete={(expenseId) => {
                    setExpenses((prev) =>
                      prev.filter(
                        (e) => e.id !== expenseId
                      )
                    );
                  }}
                  canEdit={tripDetails.canEdit}
                />
              ) : (
                <CategorizedExpenses
                  tripId={tripDetails.id}
                  expenses={expenses}
                  onEdit={(expense) =>
                    setSelectedExpense(expense)
                  }  
                  onDelete={(expenseId) => {
                    setExpenses((prev) =>
                      prev.filter(
                        (e) => e.id !== expenseId
                      )
                    );
                  }} 
                  canEdit={tripDetails.canEdit}             
                />
              )}
            </div>
          </div>
        </div>
        </>
      )}
    </AppLayout>
  );
}