import { useMutation } from '@tanstack/react-query';

import type {
  AdminImageSearchRequest,
  AdminSearchResult,
} from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';

/**
 * 서버 DTO에는 category가 있는데 생성 타입(AdminImageSearchRequest)에는 빠져 있어 보탠다.
 * SSR도 category를 같이 보낸다.
 */
export type ImageSearchBody = AdminImageSearchRequest & { category?: string };

/** 이미지 URL → base64 → eBay search_by_image → 필터 → 상위 10개 유사도 (20~30초 걸림) */
export const postImageSearch = (body: ImageSearchBody) =>
  request<AdminSearchResult>({
    method: HTTPMethod.POST,
    url: API_ENDPOINT.COMPARE.IMAGE_SEARCH,
    body,
  });

export const useImageSearchMutation = () =>
  useMutation({
    mutationFn: postImageSearch,
    meta: { skipGlobalErrorToast: true },
  });
