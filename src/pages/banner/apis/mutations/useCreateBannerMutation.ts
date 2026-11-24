import { useMutation, useQueryClient } from '@tanstack/react-query';

import type {
  AdminBannerCreateRequest,
  AdminBannerResponse,
} from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

export const postBanner = (body: AdminBannerCreateRequest) =>
  request<AdminBannerResponse>({
    method: HTTPMethod.POST,
    url: API_ENDPOINT.BANNER.LIST,
    body,
  });

export const useCreateBannerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postBanner,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.banner.list() }),
  });
};
