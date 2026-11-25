import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { AdminTagRequestDTO } from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

export const postTag = (body: AdminTagRequestDTO) =>
  request<string>({
    method: HTTPMethod.POST,
    url: API_ENDPOINT.TAG.ITEM,
    body,
  });

export const useCreateTagMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postTag,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.tag.list() }),
  });
};
