import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type { AdminCurationRawProductListResponse } from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

import type { RawProductCategory } from '../../utils/rawProductForm';

export interface RawProductListParams {
  /** 0부터 시작 */
  page: number;
  size: number;
  category?: RawProductCategory;
  minListPrice?: number;
  maxListPrice?: number;
}

export const getRawProductList = ({
  page,
  size,
  category,
  minListPrice,
  maxListPrice,
}: RawProductListParams) =>
  request<AdminCurationRawProductListResponse>({
    method: HTTPMethod.GET,
    url: API_ENDPOINT.RAW_PRODUCT.LIST,
    query: { page, size, category, minListPrice, maxListPrice },
  });

/** RAW 상품 목록 (카테고리 · 가격 범위 필터, 페이지네이션). 페이지를 넘길 때 이전 목록을 유지한다 */
export const useRawProductListQuery = (params: RawProductListParams) =>
  useQuery({
    queryKey: queryKeys.curationRawProduct.list(params),
    queryFn: () => getRawProductList(params),
    placeholderData: keepPreviousData,
  });
