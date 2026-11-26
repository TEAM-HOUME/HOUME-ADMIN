import { useMutation, useQueryClient } from '@tanstack/react-query';

import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

export const deleteRawProduct = (rawProductId: number) =>
  request<string>({
    method: HTTPMethod.DELETE,
    url: API_ENDPOINT.RAW_PRODUCT.DETAIL(rawProductId),
  });

export const useDeleteRawProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRawProduct,
    onSuccess: (_data, rawProductId) => {
      // 지운 상품의 상세는 다시 요청하면 404가 나므로 캐시에서 뺀다
      queryClient.removeQueries({
        queryKey: queryKeys.curationRawProduct.detail(rawProductId),
      });
      return queryClient.invalidateQueries({
        queryKey: queryKeys.curationRawProduct.all,
      });
    },
  });
};
