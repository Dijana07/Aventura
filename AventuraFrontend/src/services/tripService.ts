import type { CreateChecklistItemRequest } from "@/models/trip/CreateChecklistItemRequest";
import { apiClient } from "../api/clientApi";
import type { ResultDto } from "@/models/common/ResultDto";
import type { CreateTripRequest } from "@/models/trip/CreateTripRequest";
import type { TripDto } from "@/models/trip/TripDto";
import type { TripPreviewDto } from "@/models/trip/TripPreviewDto";
import type { UpdateTripRequest } from "@/models/trip/UpdateTripRequest";
import type { ChecklistItemDto } from "@/models/trip/ChecklistItemDto";
import type { UpdateChecklistItemRequest } from "@/models/trip/UpdateChecklistItemRequest";
import type { DeleteChecklistItemRequest } from "@/models/trip/DeleteChecklistItemRequest";
import type { CreateShareTokenRequest } from "@/models/trip/CreateShareTokenRequest";
import type { ShareTokenDto } from "@/models/trip/ShareTokenDto";

export const tripService = {
  getTripPreviews(): Promise<ResultDto<TripPreviewDto[]>> {
    return apiClient("/trip/all", {
      method: "GET",
    });
  },

  getLastThreeTripsPreviews(): Promise<ResultDto<TripPreviewDto[]>> {
    return apiClient("/trip/lastThree", {
      method: "GET",
    });
  },

  getAllTripPreviewsForAdmin(): Promise<ResultDto<TripPreviewDto[]>> {
    return apiClient("/trip/admin/all", {
      method: "GET",
    });
  },

  createTrip(tripData: CreateTripRequest): Promise<ResultDto<TripDto>> {
    return apiClient("/trip/create", {
      method: "POST",
      body: tripData,
    });
  },

  getTripDetails(tripId: string): Promise<ResultDto<TripDto>> {
    return apiClient(`/trip/${tripId}`, {
      method: "GET",
    });
  },

  updateTrip(request: UpdateTripRequest): Promise<ResultDto<TripDto>> {
    const formData = new FormData();

    formData.append("tripId", request.tripId);

    if (request.title) {
      formData.append("title", request.title);
    }

    if (request.startDate) {
      formData.append("startDate", request.startDate);
    }

    if (request.endDate) {
      formData.append("endDate", request.endDate);
    }

    if (request.budget) {
      formData.append("budget", request.budget.toString());
    }

    if (request.notes) {
      formData.append("notes", request.notes);
    } 

    if (request.image) {
      formData.append("image", request.image);
    }

    return apiClient("/trip/update", {
      method: "PUT",
      body: formData,
    });
  },

  deleteTrip(tripId: string): Promise<ResultDto<boolean>> {
    return apiClient(`/trip/${tripId}`, {
      method: "DELETE"
    });
  },

  createChecklistItem(request: CreateChecklistItemRequest): Promise<ResultDto<ChecklistItemDto>> {
    return apiClient("/trip/checklist/create", {
      method: "POST",
      body: request,
    });
  },

  updateChecklistItem(request: UpdateChecklistItemRequest): Promise<ResultDto<ChecklistItemDto>> {
    return apiClient("/trip/checklist/update", {
      method: "PUT",
      body: request,
    });
  },

  deleteChecklistItem(request: DeleteChecklistItemRequest): Promise<ResultDto<boolean>> {
    return apiClient("/trip/checklist", {
      method: "DELETE",
      body: request,
    });
  },

  createOrGetShareToken(request: CreateShareTokenRequest): Promise<ResultDto<ShareTokenDto>> {
    return apiClient("/trip/token/create", {
      method: "POST",
      body: request,
    })
  },

  getTripByToken(token: string): Promise<ResultDto<TripDto>> {
    return apiClient(`/trip/share/${token}`, {
      method: "GET",
    })
  }
};