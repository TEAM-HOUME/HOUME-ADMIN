import { useQuery } from '@tanstack/react-query';

import type { AdminFurnitureTypeListResponse } from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

export const getFurnitureTypeList = () =>
  request<AdminFurnitureTypeListResponse>({
    method: HTTPMethod.GET,
    url: API_ENDPOINT.FURNITURE_TYPE.LIST,
  });

/** 가구 타입 목록 — 가구 타입 관리 표와 가구 관리의 타입 선택에서 같이 쓴다 */
export const useFurnitureTypeListQuery = () =>
  useQuery({
    queryKey: queryKeys.furnitureType.list(),
    queryFn: getFurnitureTypeList,
    select: (data) => data.furnitureTypeList ?? [],
  });
