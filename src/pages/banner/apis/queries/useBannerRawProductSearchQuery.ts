import { useQuery } from '@tanstack/react-query';

import type { AdminBannerRawProductSearchResponse } from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

export const getBannerRawProductSearch = (keyword: string, size: number) =>
  request<AdminBannerRawProductSearchResponse>({
    method: HTTPMethod.GET,
    url: API_ENDPOINT.BANNER.RAW_PRODUCT_SEARCH,
    query: { keyword, size },
  });

/**
 * 배너용 RAW 상품 검색 (상품명·브랜드·source·productId).
 * 검색 버튼을 눌러 확정된 keyword가 있을 때만 요청한다. size는 서버 기준 1~50.
 */
export const useBannerRawProductSearchQuery = (keyword: string, size: number) =>
  useQuery({
    queryKey: queryKeys.banner.rawProductSearch(keyword, size),
    queryFn: () => getBannerRawProductSearch(keyword, size),
    enabled: keyword !== '',
    select: (data) => data.rawProducts ?? [],
  });
