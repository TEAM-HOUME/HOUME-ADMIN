import { useMutation } from '@tanstack/react-query';

import type {
  KeywordCheckRequest,
  KeywordCheckResponse,
} from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';

/** 한글 상품명 → Gemini 번역 → eBay 영문 키워드 + 쿠팡 한글 키워드 (5~10초 걸림) */
export const postKeywordCheck = (body: KeywordCheckRequest) =>
  request<KeywordCheckResponse>({
    method: HTTPMethod.POST,
    url: API_ENDPOINT.COMPARE.KEYWORD_CHECK,
    body,
  });

export const useKeywordCheckMutation = () =>
  useMutation({
    mutationFn: postKeywordCheck,
    // 오류를 입력칸 아래에 보여준다 (SSR과 같음)
    meta: { skipGlobalErrorToast: true },
  });
