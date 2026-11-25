import { useQuery } from '@tanstack/react-query';

import type { AdminFurnitureDetailsResponseDTO } from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

export const getFurniturePrompt = (furnitureNameKr: string, tagId: number) =>
  request<AdminFurnitureDetailsResponseDTO>({
    method: HTTPMethod.GET,
    url: API_ENDPOINT.FURNITURE.PROMPT,
    query: { furnitureNameKr, tagId },
  });

/** 가구(한글 이름) + 태그 조합의 프롬프트. 조합이 정해졌을 때만 요청한다 */
export const useFurniturePromptQuery = (
  target: { furnitureNameKr: string; tagId: number } | null
) =>
  useQuery({
    queryKey: queryKeys.furniture.prompt(
      target?.furnitureNameKr ?? '',
      target?.tagId ?? -1
    ),
    queryFn: () =>
      getFurniturePrompt(target?.furnitureNameKr ?? '', target?.tagId ?? -1),
    enabled: target !== null,
    select: (data) => data.prompt ?? '',
  });
