import { useMutation } from '@tanstack/react-query';

import type {
  AdminSearchResult,
  AdminTextSearchRequest,
} from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';

/** 한글 상품명 → 키워드 번역 → eBay 검색 → 필터 → 상위 10개 유사도 (20~30초 걸림) */
export const postTextSearch = (body: AdminTextSearchRequest) =>
  request<AdminSearchResult>({
    method: HTTPMethod.POST,
    url: API_ENDPOINT.COMPARE.TEXT_SEARCH,
    body,
  });

export const useTextSearchMutation = () =>
  useMutation({
    mutationFn: postTextSearch,
    // 오류를 결과 자리에 보여준다 (SSR과 같음)
    meta: { skipGlobalErrorToast: true },
  });
