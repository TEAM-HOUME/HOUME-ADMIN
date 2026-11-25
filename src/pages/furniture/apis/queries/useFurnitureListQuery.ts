import { useQuery } from '@tanstack/react-query';

import type { AdminFurnitureGetDTO } from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

export const getFurnitureList = () =>
  request<AdminFurnitureGetDTO>({
    method: HTTPMethod.GET,
    url: API_ENDPOINT.FURNITURE.LIST,
  });

/** 등록된 가구 + 가구마다 연결된 태그(이미지 · 키워드 · 우선순위) */
export const useFurnitureListQuery = () =>
  useQuery({
    queryKey: queryKeys.furniture.list(),
    queryFn: getFurnitureList,
    select: (data) => data.furnitures ?? [],
  });
