import { useQuery } from '@tanstack/react-query';

import type { AdminTagGetAllResponseDTO } from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

export const getTagList = () =>
  request<AdminTagGetAllResponseDTO>({
    method: HTTPMethod.GET,
    url: API_ENDPOINT.TAG.LIST,
  });

/** 스타일 태그 목록 — 태그 관리 표와 무드보드 · 가구의 태그 선택에서 같이 쓴다 */
export const useTagListQuery = () =>
  useQuery({
    queryKey: queryKeys.tag.list(),
    queryFn: getTagList,
    select: (data) => data.tagGetResponseDTOS ?? [],
  });
