import { useQuery } from '@tanstack/react-query';

import type { AdminCurationRawProductColorOptionResponse } from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

export const getRawColorOptions = () =>
  request<AdminCurationRawProductColorOptionResponse[]>({
    method: HTTPMethod.GET,
    url: API_ENDPOINT.RAW_PRODUCT.COLOR_OPTIONS,
  });

/** 표준 색상 목록 (label: 색상 이름, value: hex). 거의 바뀌지 않아 오래 캐시한다 */
export const useRawColorOptionsQuery = () =>
  useQuery({
    queryKey: queryKeys.curationRawProduct.colorOptions(),
    queryFn: getRawColorOptions,
    staleTime: Infinity,
  });
