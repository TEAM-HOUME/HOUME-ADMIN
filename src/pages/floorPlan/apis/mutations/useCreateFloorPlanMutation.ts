import { useMutation, useQueryClient } from '@tanstack/react-query';

import type {
  AdminFloorPlanCreateRequest,
  AdminFloorPlanResponse,
} from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

export const postFloorPlan = (body: AdminFloorPlanCreateRequest) =>
  request<AdminFloorPlanResponse>({
    method: HTTPMethod.POST,
    url: API_ENDPOINT.FLOOR_PLAN.LIST,
    body,
  });

export const useCreateFloorPlanMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postFloorPlan,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.floorPlan.list() }),
  });
};
