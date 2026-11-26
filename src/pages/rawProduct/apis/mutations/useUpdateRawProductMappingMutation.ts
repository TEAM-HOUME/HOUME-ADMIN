import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { AdminCurationRawProductFurnitureTagResponse } from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

interface PatchRawProductMappingParams {
  rawProductId: number;
  mappingId: number;
  furnitureTagId: number;
}

/** 기존 매핑이 가리키는 가구 태그를 다른 것으로 바꾼다 */
export const patchRawProductMapping = ({
  rawProductId,
  mappingId,
  furnitureTagId,
}: PatchRawProductMappingParams) =>
  request<AdminCurationRawProductFurnitureTagResponse>({
    method: HTTPMethod.PATCH,
    url: API_ENDPOINT.RAW_PRODUCT.MAPPING(rawProductId, mappingId),
    body: { furnitureTagId },
  });

export const useUpdateRawProductMappingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patchRawProductMapping,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.curationRawProduct.all,
      }),
  });
};
