import { useMutation, useQueryClient } from '@tanstack/react-query';

import type {
  AdminLandingResponse,
  AdminLandingUpdateRequest,
} from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

interface PatchLandingParams {
  landingId: number;
  body: AdminLandingUpdateRequest;
}

export const patchLanding = ({ landingId, body }: PatchLandingParams) =>
  request<AdminLandingResponse>({
    method: HTTPMethod.PATCH,
    url: API_ENDPOINT.LANDING.DETAIL(landingId),
    body,
  });

export const useUpdateLandingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patchLanding,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.landing.list() }),
  });
};
