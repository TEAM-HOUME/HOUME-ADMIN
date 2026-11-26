import { useMutation } from '@tanstack/react-query';

import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';

/**
 * 자체 카탈로그 임베딩 배치 — 서버가 백그라운드로 돌리고 202와 안내 문구를 바로 돌려준다.
 * 이미 실행 중이면 409. 결과는 서버 로그에서 확인한다.
 */
export const triggerCurationEmbedding = (limit: number) =>
  request<string>({
    method: HTTPMethod.POST,
    url: API_ENDPOINT.COMPARE.EMBEDDING_TRIGGER,
    query: { limit },
  });

export const useTriggerCurationEmbeddingMutation = () =>
  useMutation({
    mutationFn: triggerCurationEmbedding,
    // 결과(시작 · 실행 중 · 오류)를 카드 아래에 직접 보여준다
    meta: { skipGlobalErrorToast: true },
  });
