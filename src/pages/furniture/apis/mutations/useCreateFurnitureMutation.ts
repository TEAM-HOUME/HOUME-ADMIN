import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { AdminFurnitureRequestDTO } from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

export const postFurniture = (body: AdminFurnitureRequestDTO) =>
  request<string>({
    method: HTTPMethod.POST,
    url: API_ENDPOINT.FURNITURE.ITEM,
    body,
  });

export const useCreateFurnitureMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postFurniture,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.furniture.list() }),
  });
};
