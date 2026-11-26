import { useQuery } from '@tanstack/react-query';

import type { PresetListResponse } from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

export const getPresets = () =>
  request<PresetListResponse>({
    method: HTTPMethod.GET,
    url: API_ENDPOINT.COMPARE.PRESETS,
  });

/** 가격비교 홈에 노출되는 예시 상품 프리셋 목록 */
export const usePresetListQuery = () =>
  useQuery({
    queryKey: queryKeys.comparePreset.list(),
    queryFn: getPresets,
    select: (data) => data.presets ?? [],
  });
