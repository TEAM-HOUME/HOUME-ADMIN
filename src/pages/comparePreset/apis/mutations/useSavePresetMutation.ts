import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { SavePresetRequest } from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

interface SavePresetParams {
  /** 있으면 수정(PUT), 없으면 등록(POST) */
  presetId: number | null;
  body: SavePresetRequest;
}

/**
 * 프리셋 등록 · 수정. SSR처럼 서버 응답 바디 전체를 화면에 보여주려고 rawResponse로 받는다
 * (등록은 data에 새 presetId가 온다).
 */
export const savePreset = ({ presetId, body }: SavePresetParams) =>
  request<number | undefined>({
    method: presetId === null ? HTTPMethod.POST : HTTPMethod.PUT,
    url:
      presetId === null
        ? API_ENDPOINT.COMPARE.PRESETS
        : API_ENDPOINT.COMPARE.PRESET(presetId),
    body,
    rawResponse: true,
  });

export const useSavePresetMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: savePreset,
    // 성공 · 실패 응답을 폼 아래에 그대로 보여준다
    meta: { skipGlobalErrorToast: true },
    // SSR은 응답과 상관없이 목록을 다시 불러온다
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.comparePreset.list(),
      }),
  });
};
