import { useMutation, useQueryClient } from '@tanstack/react-query';

import type {
  AdminCreditGrantRequest,
  AdminCreditGrantResponse,
} from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

interface PostCreditGrantParams {
  memberId: number;
  body: AdminCreditGrantRequest;
}

export const postCreditGrant = ({ memberId, body }: PostCreditGrantParams) =>
  request<AdminCreditGrantResponse>({
    method: HTTPMethod.POST,
    url: API_ENDPOINT.MEMBER.CREDITS(memberId),
    body,
  });

export const useGrantCreditMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCreditGrant,
    // 검색 결과 표의 잔액을 서버 값으로 다시 맞춘다
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.member.all }),
  });
};
