import { useQuery } from '@tanstack/react-query';

import type { AdminCurationRawProductResponse } from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

export const getRawProductDetail = (rawProductId: number) =>
  request<AdminCurationRawProductResponse>({
    method: HTTPMethod.GET,
    url: API_ENDPOINT.RAW_PRODUCT.DETAIL(rawProductId),
  });

/** RAW 상품 상세. 고른 상품이 있을 때만 요청한다 */
export const useRawProductDetailQuery = (rawProductId: number | null) =>
  useQuery({
    queryKey: queryKeys.curationRawProduct.detail(rawProductId ?? -1),
    queryFn: () => getRawProductDetail(rawProductId ?? -1),
    enabled: rawProductId !== null,
  });
