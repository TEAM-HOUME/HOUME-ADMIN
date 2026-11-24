import { useQuery } from '@tanstack/react-query';

import type { AdminLandingListResponse } from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

export const getLandingList = () =>
  request<AdminLandingListResponse>({
    method: HTTPMethod.GET,
    url: API_ENDPOINT.LANDING.LIST,
  });

export const useLandingListQuery = () =>
  useQuery({
    queryKey: queryKeys.landing.list(),
    queryFn: getLandingList,
    select: (data) => data.landings ?? [],
  });
