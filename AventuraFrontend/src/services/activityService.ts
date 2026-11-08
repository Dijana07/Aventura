import { apiClient } from "../api/clientApi";
import type { ResultDto } from "@/models/common/ResultDto";
import type { CreateActivityRequest } from "@/models/activity/CreateActivityRequest";
import type { ActivityDto } from "@/models/activity/ActivityDto";
import type { UpdateActivityRequest } from "@/models/activity/UpdateActivityRequest";
import type { DeleteActivityRequest } from "@/models/activity/DeleteActivityRequest";

export const activityService = {
  createActivity(activityData: CreateActivityRequest): Promise<ResultDto<ActivityDto>> {
    return apiClient("/activity/create", {
      method: "POST",
      body: activityData,
    });
  },

  updateActivity(request: UpdateActivityRequest): Promise<ResultDto<ActivityDto>> {     
    return apiClient("/activity/update", {
      method: "PUT",
      body: request,
    });
  },

  deleteActivity(request: DeleteActivityRequest): Promise<ResultDto<boolean>> {
    return apiClient("/activity", {
      method: "DELETE",
      body: request,
    });
  }
};