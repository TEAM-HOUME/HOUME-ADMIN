import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { AdminFurnitureTypeRequest } from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

export const postFurnitureType = (body: AdminFurnitureTypeRequest) =>
  request<string>({
    method: HTTPMethod.POST,
    url: API_ENDPOINT.FURNITURE_TYPE.ITEM,
    body,
  });

export const useCreateFurnitureTypeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postFurnitureType,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.furnitureType.list(),
      }),
  });
};
