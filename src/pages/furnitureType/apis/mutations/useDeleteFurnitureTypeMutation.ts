import { useMutation, useQueryClient } from '@tanstack/react-query';

import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

/**
 * 가구 타입 삭제는 body로 furnitureTypeId를 받는다.
 * 그 타입을 쓰는 가구가 있으면 서버가 거절한다 (CANNOT_DELETE_FURNITURE_TYPE_IN_USE)
 */
export const deleteFurnitureType = (furnitureTypeId: number) =>
  request<string>({
    method: HTTPMethod.DELETE,
    url: API_ENDPOINT.FURNITURE_TYPE.ITEM,
    body: { furnitureTypeId },
  });

export const useDeleteFurnitureTypeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFurnitureType,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.furnitureType.list(),
      }),
  });
};
