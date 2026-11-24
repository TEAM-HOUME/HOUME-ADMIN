import { useQuery } from '@tanstack/react-query';

import type { AdminBannerListResponse } from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

export const getBannerList = () =>
  request<AdminBannerListResponse>({
    method: HTTPMethod.GET,
    url: API_ENDPOINT.BANNER.LIST,
  });

export const useBannerListQuery = () =>
  useQuery({
    queryKey: queryKeys.banner.list(),
    queryFn: getBannerList,
    select: (data) => data.banners ?? [],
  });
