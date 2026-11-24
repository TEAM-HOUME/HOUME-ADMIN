import { useMutation, useQueryClient } from '@tanstack/react-query';

import type {
  AdminFloorPlanResponse,
  AdminFloorPlanUpdateRequest,
} from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

interface PatchFloorPlanParams {
  floorPlanId: number;
  body: AdminFloorPlanUpdateRequest;
}

export const patchFloorPlan = ({ floorPlanId, body }: PatchFloorPlanParams) =>
  request<AdminFloorPlanResponse>({
    method: HTTPMethod.PATCH,
    url: API_ENDPOINT.FLOOR_PLAN.DETAIL(floorPlanId),
    body,
  });

export const useUpdateFloorPlanMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patchFloorPlan,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.floorPlan.list() }),
  });
};
