import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { AdminCurationRawProductFurnitureTagResponse } from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

interface PostRawProductMappingParams {
  rawProductId: number;
  furnitureTagId: number;
}

/** RAW 상품에 가구 태그(furniture_tag) 매핑 하나를 추가한다 */
export const postRawProductMapping = ({
  rawProductId,
  furnitureTagId,
}: PostRawProductMappingParams) =>
  request<AdminCurationRawProductFurnitureTagResponse>({
    method: HTTPMethod.POST,
    url: API_ENDPOINT.RAW_PRODUCT.MAPPINGS(rawProductId),
    body: { furnitureTagId },
  });

export const useCreateRawProductMappingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postRawProductMapping,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.curationRawProduct.all,
      }),
  });
};
