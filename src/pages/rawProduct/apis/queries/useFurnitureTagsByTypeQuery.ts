import { useQuery } from '@tanstack/react-query';

import type { AdminFurnitureTagOptionListResponse } from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

export const getFurnitureTagsByType = (furnitureTypeId: number) =>
  request<AdminFurnitureTagOptionListResponse>({
    method: HTTPMethod.GET,
    url: API_ENDPOINT.FURNITURE_TYPE.TAGS(furnitureTypeId),
  });

/** 가구 타입에 연결된 furniture_tag 목록. 타입을 고른 뒤에만 요청한다 */
export const useFurnitureTagsByTypeQuery = (furnitureTypeId: number | null) =>
  useQuery({
    queryKey: queryKeys.furnitureType.tags(furnitureTypeId ?? -1),
    queryFn: () => getFurnitureTagsByType(furnitureTypeId ?? -1),
    enabled: furnitureTypeId !== null,
    select: (data) => data.furnitureTags ?? [],
  });
