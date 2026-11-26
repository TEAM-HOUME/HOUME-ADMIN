import { useQuery } from '@tanstack/react-query';

import type { AdminFurnitureOptionListResponse } from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

export const getFurnituresByType = (furnitureTypeId: number) =>
  request<AdminFurnitureOptionListResponse>({
    method: HTTPMethod.GET,
    url: API_ENDPOINT.FURNITURE_TYPE.FURNITURES(furnitureTypeId),
  });

/** 가구 타입(상위가구)에 속한 하위가구 목록. 타입을 고른 뒤에만 요청한다 */
export const useFurnituresByTypeQuery = (furnitureTypeId: number | null) =>
  useQuery({
    queryKey: queryKeys.furnitureType.furnitures(furnitureTypeId ?? -1),
    queryFn: () => getFurnituresByType(furnitureTypeId ?? -1),
    enabled: furnitureTypeId !== null,
    select: (data) => data.furnitures ?? [],
  });
