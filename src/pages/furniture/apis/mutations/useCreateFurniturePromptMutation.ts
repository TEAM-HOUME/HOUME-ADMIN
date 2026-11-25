import { useMutation, useQueryClient } from '@tanstack/react-query';

import type {
  AdminFurniturePromptCreateResponseDTO,
  AdminFurniturePromptRequestDTO,
} from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';
import { putImageToPresignedUrl } from '@apis/mutations/useImageUploadMutation';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

import { getFileExtension } from '@utils/getFileExtension';

export const postFurniturePrompt = (
  body: AdminFurniturePromptRequestDTO,
  contentType: string
) =>
  request<AdminFurniturePromptCreateResponseDTO>({
    method: HTTPMethod.POST,
    url: API_ENDPOINT.FURNITURE.PROMPT,
    query: { contentType },
    body,
  });

export type CreateFurniturePromptParams = Omit<
  AdminFurniturePromptRequestDTO,
  'imageExtension'
> & { file: File };

/**
 * 가구 프롬프트 등록 (presignedUrl 방식).
 * 1) POST /furniture/prompt?contentType= → 서버가 가구-태그 연결을 먼저 만들고 presignedUrl을 준다
 * 2) presignedUrl로 S3에 대표 이미지 PUT
 * 2단계가 실패하면 이미지 없는 연결이 남는다 (SSR과 같은 구조) → 메시지로 구분해 알린다
 */
export const createFurniturePrompt = async ({
  file,
  ...body
}: CreateFurniturePromptParams) => {
  const { presignedUrl } = await postFurniturePrompt(
    { ...body, imageExtension: getFileExtension(file) },
    file.type
  );
  if (!presignedUrl) {
    throw new Error('프롬프트 등록 응답에 업로드 URL이 없습니다.');
  }

  try {
    await putImageToPresignedUrl(presignedUrl, file, file.type);
  } catch {
    throw new Error(
      '프롬프트는 등록됐지만 대표 이미지 S3 업로드에 실패했습니다. 가구 정보 수정에서 이미지를 다시 올려주세요.'
    );
  }
};

export const useCreateFurniturePromptMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFurniturePrompt,
    // 실패 메시지는 폼 안에 보여준다
    meta: { skipGlobalErrorToast: true },
    // S3 단계에서 실패해도 연결은 생겼으므로 목록은 항상 다시 받는다
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.furniture.all }),
  });
};
