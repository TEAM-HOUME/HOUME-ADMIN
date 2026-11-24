import { useMutation, useQueryClient } from '@tanstack/react-query';

import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

export const deleteFloorPlan = (floorPlanId: number) =>
  request<string>({
    method: HTTPMethod.DELETE,
    url: API_ENDPOINT.FLOOR_PLAN.DETAIL(floorPlanId),
  });

export const useDeleteFloorPlanMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFloorPlan,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.floorPlan.list() }),
  });
};
