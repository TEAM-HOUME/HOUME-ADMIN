import { useMutation, useQueryClient } from '@tanstack/react-query';

import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

export const deletePreset = (presetId: number) =>
  request<void>({
    method: HTTPMethod.DELETE,
    url: API_ENDPOINT.COMPARE.PRESET(presetId),
  });

export const useDeletePresetMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePreset,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.comparePreset.list(),
      }),
  });
};
