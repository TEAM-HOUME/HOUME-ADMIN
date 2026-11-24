import { useMutation, useQueryClient } from '@tanstack/react-query';

import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

/** 무드보드는 id가 아니라 저장 파일 이름(filename)으로 지운다 */
export const deleteMoodboard = (filename: string) =>
  request<string>({
    method: HTTPMethod.DELETE,
    url: API_ENDPOINT.MOODBOARD.ITEM,
    query: { filename },
  });

export const useDeleteMoodboardMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMoodboard,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.moodboard.list() }),
  });
};
