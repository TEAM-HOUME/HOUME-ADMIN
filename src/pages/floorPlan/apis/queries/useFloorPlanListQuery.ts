import { useQuery } from '@tanstack/react-query';

import type { AdminFloorPlanListResponse } from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

export const getFloorPlanList = () =>
  request<AdminFloorPlanListResponse>({
    method: HTTPMethod.GET,
    url: API_ENDPOINT.FLOOR_PLAN.LIST,
  });

export const useFloorPlanListQuery = () =>
  useQuery({
    queryKey: queryKeys.floorPlan.list(),
    queryFn: getFloorPlanList,
    select: (data) => data.floorPlans ?? [],
  });
