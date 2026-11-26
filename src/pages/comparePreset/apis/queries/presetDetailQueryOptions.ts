import { queryOptions } from '@tanstack/react-query';

import type { PresetDetailResponse } from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

/** 수정 폼을 채울 프리셋 상세 — 공개 API를 토큰 없이 부른다 (SSR과 같음) */
export const getPresetDetail = (presetId: number) =>
  request<PresetDetailResponse>({
    method: HTTPMethod.GET,
    url: API_ENDPOINT.COMPARE.PRESET_DETAIL(presetId),
  });

/**
 * '수정'을 누를 때마다 최신 값으로 폼을 채운다 → 캐시를 쓰지 않는다 (staleTime 0).
 * 화면에서 queryClient.fetchQuery로 부른다.
 */
export const presetDetailQueryOptions = (presetId: number) =>
  queryOptions({
    queryKey: queryKeys.comparePreset.detail(presetId),
    queryFn: () => getPresetDetail(presetId),
    staleTime: 0,
  });
