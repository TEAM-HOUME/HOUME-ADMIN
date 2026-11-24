import { useMutation, useQueryClient } from '@tanstack/react-query';

import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

export const deleteStyle = (styleId: number) =>
  request<string>({
    method: HTTPMethod.DELETE,
    url: API_ENDPOINT.STYLE.DETAIL(styleId),
  });

export const useDeleteStyleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStyle,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.style.list() }),
  });
};
