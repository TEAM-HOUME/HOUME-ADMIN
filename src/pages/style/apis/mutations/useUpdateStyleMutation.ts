import { useMutation, useQueryClient } from '@tanstack/react-query';

import type {
  AdminStyleResponse,
  AdminStyleUpdateRequest,
} from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

interface PatchStyleParams {
  styleId: number;
  body: AdminStyleUpdateRequest;
}

export const patchStyle = ({ styleId, body }: PatchStyleParams) =>
  request<AdminStyleResponse>({
    method: HTTPMethod.PATCH,
    url: API_ENDPOINT.STYLE.DETAIL(styleId),
    body,
  });

export const useUpdateStyleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patchStyle,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.style.list() }),
  });
};
