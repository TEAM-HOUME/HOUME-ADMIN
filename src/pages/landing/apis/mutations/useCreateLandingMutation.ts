import { useMutation, useQueryClient } from '@tanstack/react-query';

import type {
  AdminLandingCreateRequest,
  AdminLandingResponse,
} from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

export const postLanding = (body: AdminLandingCreateRequest) =>
  request<AdminLandingResponse>({
    method: HTTPMethod.POST,
    url: API_ENDPOINT.LANDING.LIST,
    body,
  });

export const useCreateLandingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postLanding,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.landing.list() }),
  });
};
