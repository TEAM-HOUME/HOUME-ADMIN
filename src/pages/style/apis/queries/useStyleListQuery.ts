import { useQuery } from '@tanstack/react-query';

import type { AdminStyleListResponse } from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

export const getStyleList = () =>
  request<AdminStyleListResponse>({
    method: HTTPMethod.GET,
    url: API_ENDPOINT.STYLE.LIST,
  });

export const useStyleListQuery = () =>
  useQuery({
    queryKey: queryKeys.style.list(),
    queryFn: getStyleList,
    select: (data) => data.styles ?? [],
  });
