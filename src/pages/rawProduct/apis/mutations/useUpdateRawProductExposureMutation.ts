import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { AdminCurationRawProductExposureUpdateRequest } from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

/** 여러 RAW 상품의 노출 여부를 한 번에 바꾼다 */
export const patchRawProductExposure = (
  body: AdminCurationRawProductExposureUpdateRequest
) =>
  request<string>({
    method: HTTPMethod.PATCH,
    url: API_ENDPOINT.RAW_PRODUCT.EXPOSURE,
    body,
  });

export const useUpdateRawProductExposureMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patchRawProductExposure,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.curationRawProduct.all,
      }),
  });
};
