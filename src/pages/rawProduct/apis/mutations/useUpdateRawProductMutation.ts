import { useMutation, useQueryClient } from '@tanstack/react-query';

import type {
  AdminCurationRawProductResponse,
  AdminCurationRawProductUpdateRequest,
} from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

interface PatchRawProductParams {
  rawProductId: number;
  body: AdminCurationRawProductUpdateRequest;
}

/**
 * 보내지 않은 항목은 유지된다.
 * colors · furnitureIds · furnitureTagIds는 보내면 통째로 교체되고, 빈 배열이면 전부 지워진다.
 */
export const patchRawProduct = ({
  rawProductId,
  body,
}: PatchRawProductParams) =>
  request<AdminCurationRawProductResponse>({
    method: HTTPMethod.PATCH,
    url: API_ENDPOINT.RAW_PRODUCT.DETAIL(rawProductId),
    body,
  });

export const useUpdateRawProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patchRawProduct,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.curationRawProduct.all,
      }),
  });
};
