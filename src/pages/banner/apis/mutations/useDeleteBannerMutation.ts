import { useMutation, useQueryClient } from '@tanstack/react-query';

import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

export const deleteBanner = (bannerId: number) =>
  request<string>({
    method: HTTPMethod.DELETE,
    url: API_ENDPOINT.BANNER.DETAIL(bannerId),
  });

export const useDeleteBannerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBanner,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.banner.list() }),
  });
};
