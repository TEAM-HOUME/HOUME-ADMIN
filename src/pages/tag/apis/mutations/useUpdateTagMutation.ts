import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { AdminTagUpdateRequestDTO } from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

/** 보내지 않은(undefined) 항목은 서버가 기존 값을 유지한다 */
export const patchTag = (body: AdminTagUpdateRequestDTO) =>
  request<string>({
    method: HTTPMethod.PATCH,
    url: API_ENDPOINT.TAG.ITEM,
    body,
  });

export const useUpdateTagMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patchTag,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.tag.list() }),
  });
};
