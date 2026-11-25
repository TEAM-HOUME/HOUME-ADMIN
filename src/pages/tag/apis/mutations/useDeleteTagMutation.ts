import { useMutation, useQueryClient } from '@tanstack/react-query';

import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

/** 태그 삭제는 경로가 아니라 body로 tagId를 받는다 */
export const deleteTag = (tagId: number) =>
  request<string>({
    method: HTTPMethod.DELETE,
    url: API_ENDPOINT.TAG.ITEM,
    body: { tagId },
  });

export const useDeleteTagMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTag,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.tag.list() }),
  });
};
