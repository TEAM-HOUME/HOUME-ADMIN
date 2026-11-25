import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { AdminUpdateFurnitureTypeRequest } from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

export const patchFurnitureType = (body: AdminUpdateFurnitureTypeRequest) =>
  request<string>({
    method: HTTPMethod.PATCH,
    url: API_ENDPOINT.FURNITURE_TYPE.ITEM,
    body,
  });

export const useUpdateFurnitureTypeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patchFurnitureType,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.furnitureType.list(),
      }),
  });
};
