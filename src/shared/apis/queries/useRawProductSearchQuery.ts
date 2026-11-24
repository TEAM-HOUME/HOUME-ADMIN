import { useQuery } from '@tanstack/react-query';

import type { AdminBannerRawProductSearchResponse } from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { queryKeys } from '@constants/queryKey';

export const getRawProductSearch = (
  endpoint: string,
  keyword: string,
  size: number
) =>
  request<AdminBannerRawProductSearchResponse>({
    method: HTTPMethod.GET,
    url: endpoint,
    query: { keyword, size },
  });

/**
 * RAW 상품 검색 (상품명·브랜드·source·productId).
 * 배너(`/banners/raw-products/search`)와 스타일(`/styles/raw-products/search`)이
 * 같은 응답 형태라 경로만 받아 같이 쓴다. size는 서버 기준 1~50.
 * 검색 버튼을 눌러 확정된 keyword가 있을 때만 요청한다.
 */
export const useRawProductSearchQuery = (
  endpoint: string,
  keyword: string,
  size: number
) =>
  useQuery({
    queryKey: queryKeys.rawProduct.search(endpoint, keyword, size),
    queryFn: () => getRawProductSearch(endpoint, keyword, size),
    enabled: keyword !== '',
    select: (data) => data.rawProducts ?? [],
  });
