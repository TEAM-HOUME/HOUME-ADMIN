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

export const useTagListQuery = () =>
  useQuery({
    queryKey: queryKeys.tag.list(),
    queryFn: getTagList,
    select: (data) => data.tagGetResponseDTOS ?? [],
  });
