import { useMutation, useQueryClient } from '@tanstack/react-query';

import type {
  AdminBannerResponse,
  AdminBannerUpdateRequest,
} from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

interface PatchBannerParams {
  bannerId: number;
  body: AdminBannerUpdateRequest;
}

export const patchBanner = ({ bannerId, body }: PatchBannerParams) =>
  request<AdminBannerResponse>({
    method: HTTPMethod.PATCH,
    url: API_ENDPOINT.BANNER.DETAIL(bannerId),
    body,
  });

export const useUpdateBannerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patchBanner,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.banner.list() }),
  });
};
