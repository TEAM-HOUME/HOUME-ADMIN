import { useMutation, useQueryClient } from '@tanstack/react-query';

import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

export const deleteLanding = (landingId: number) =>
  request<string>({
    method: HTTPMethod.DELETE,
    url: API_ENDPOINT.LANDING.DETAIL(landingId),
  });

export const useDeleteLandingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLanding,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.landing.list() }),
  });
};
