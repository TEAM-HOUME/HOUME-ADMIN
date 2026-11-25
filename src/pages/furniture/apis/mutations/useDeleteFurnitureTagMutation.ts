import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { AdminFurnitureTagDeleteDTO } from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

/** 가구-태그 연결(가구 프롬프트) 하나를 지운다 */
export const deleteFurnitureTag = (body: AdminFurnitureTagDeleteDTO) =>
  request<string>({
    method: HTTPMethod.DELETE,
    url: API_ENDPOINT.FURNITURE.TAG,
    body,
  });

export const useDeleteFurnitureTagMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFurnitureTag,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.furniture.all }),
  });
};
