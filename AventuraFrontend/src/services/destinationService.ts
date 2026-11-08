import type { CreateDestinationRequest } from "@/models/destination/CreateDestinationRequest";
import { apiClient } from "../api/clientApi";
import type { ResultDto } from "@/models/common/ResultDto";
import type { DestinationDto } from "@/models/destination/DestinationDto";
import type { UpdateDestinationRequest } from "@/models/destination/UpdateDestinationRequest";
import type { DeleteDestinationRequest } from "@/models/destination/DeleteDestinationRequest";

export const destinationService = {
  createDestnation(destinationData: CreateDestinationRequest): Promise<ResultDto<DestinationDto>> {
    return apiClient("/destination/create", {
      method: "POST",
      body:destinationData,
    });
  },

  updateDestination(request: UpdateDestinationRequest): Promise<ResultDto<DestinationDto>> {     
    return apiClient("/destination/update", {
      method: "PUT",
      body: request,
    });
  },

  deleteDestination(request: DeleteDestinationRequest): Promise<ResultDto<boolean>> {
    return apiClient("/destination", {
      method: "DELETE",
      body: request,
    });
  }
};