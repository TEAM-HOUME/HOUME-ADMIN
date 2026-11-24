import { useQuery } from '@tanstack/react-query';

import type { AdminMemberSearchResponse } from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

export const getMemberSearch = (keyword: string) =>
  request<AdminMemberSearchResponse>({
    method: HTTPMethod.GET,
    url: API_ENDPOINT.MEMBER.SEARCH,
    query: { keyword },
  });

/**
 * 회원 검색 (이메일 완전일치 또는 닉네임 부분검색, 현재 크레딧 잔액 포함).
 * 검색 버튼을 눌러 확정된 keyword가 있을 때만 요청한다.
 */
export const useMemberSearchQuery = (keyword: string) =>
  useQuery({
    queryKey: queryKeys.member.search(keyword),
    queryFn: () => getMemberSearch(keyword),
    enabled: keyword !== '',
    // 잔액은 지급 직후 바뀌므로 캐시를 오래 믿지 않는다
    staleTime: 0,
    select: (data) => data.members ?? [],
  });
