import { useMutation, useQueryClient } from '@tanstack/react-query';

import type {
  AdminStyleCreateRequest,
  AdminStyleResponse,
} from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

export const postStyle = (body: AdminStyleCreateRequest) =>
  request<AdminStyleResponse>({
    method: HTTPMethod.POST,
    url: API_ENDPOINT.STYLE.LIST,
    body,
  });

export const useCreateStyleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postStyle,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.style.list() }),
  });
};
