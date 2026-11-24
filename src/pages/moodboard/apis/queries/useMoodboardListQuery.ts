import { useQuery } from '@tanstack/react-query';

import type { AdminMoodBoardGetAllResponseDTO } from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

export const getMoodboardList = () =>
  request<AdminMoodBoardGetAllResponseDTO>({
    method: HTTPMethod.GET,
    url: API_ENDPOINT.MOODBOARD.LIST,
  });

export const useMoodboardListQuery = () =>
  useQuery({
    queryKey: queryKeys.moodboard.list(),
    queryFn: getMoodboardList,
    select: (data) => data.dtos ?? [],
  });
