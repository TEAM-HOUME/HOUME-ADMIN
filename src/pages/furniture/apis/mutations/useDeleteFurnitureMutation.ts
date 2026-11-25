import { useMutation, useQueryClient } from '@tanstack/react-query';

import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

/** 가구는 id가 아니라 한글 이름(furnitureNameKr)으로 지운다 */
export const deleteFurniture = (furnitureNameKr: string) =>
  request<string>({
    method: HTTPMethod.DELETE,
    url: API_ENDPOINT.FURNITURE.ITEM,
    body: { furnitureNameKr },
  });

export const useDeleteFurnitureMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFurniture,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.furniture.all }),
  });
};
