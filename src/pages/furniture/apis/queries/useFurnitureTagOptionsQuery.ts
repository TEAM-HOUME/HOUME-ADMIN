import { useQuery } from '@tanstack/react-query';

import type { AdminFurnitureTagGetDTO } from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

export interface FurnitureTagOption {
  tagId: number;
  tagNameKr: string;
}

export const getFurnitureTagOptions = () =>
  request<AdminFurnitureTagGetDTO>({
    method: HTTPMethod.GET,
    url: API_ENDPOINT.FURNITURE.TAG_OPTIONS,
  });

/**
 * 가구 화면(프롬프트 등록 · 정보 수정 · 프롬프트 조회)의 스타일 태그 선택지.
 * 서버가 id 배열과 이름 배열을 따로 주므로 같은 순서끼리 묶는다 (SSR populateTagDropdown과 같음).
 */
export const useFurnitureTagOptionsQuery = () =>
  useQuery({
    queryKey: queryKeys.furniture.tagOptions(),
    queryFn: getFurnitureTagOptions,
    select: ({ tagId = [], tagNameKr = [] }): FurnitureTagOption[] =>
      tagId.map((id, index) => ({
        tagId: id,
        tagNameKr: tagNameKr[index] ?? '',
      })),
  });
