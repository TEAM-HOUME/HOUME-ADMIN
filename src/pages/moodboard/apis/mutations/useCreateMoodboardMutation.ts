import { useMutation, useQueryClient } from '@tanstack/react-query';

import type {
  AdminMoodBoardCreateRequestDTO,
  AdminMoodBoardCreateResponseDTO,
} from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';
import { putImageToPresignedUrl } from '@apis/mutations/useImageUploadMutation';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

export const postMoodboard = (
  body: AdminMoodBoardCreateRequestDTO,
  contentType: string
) =>
  request<AdminMoodBoardCreateResponseDTO>({
    method: HTTPMethod.POST,
    url: API_ENDPOINT.MOODBOARD.ITEM,
    query: { contentType },
    body,
  });

interface CreateMoodboardParams {
  file: File;
  /** 사용자에게 보여질 이름 (예: 미드센추리 블루 스타일) */
  originalFilename: string;
  tagId: number;
}

/** S3 업로드 단계에서 실패했음을 구분하기 위한 에러 */
class MoodboardS3UploadError extends Error {
  constructor() {
    super(
      '무드보드는 등록됐지만 S3 이미지 업로드에 실패했습니다. 목록에서 이미지가 비어 있는 항목을 삭제한 뒤 다시 업로드해주세요.'
    );
    this.name = 'MoodboardS3UploadError';
  }
}

/**
 * 무드보드 등록 (presignedUrl 방식).
 * 1) POST /moodboard?contentType= → 서버가 무드보드를 먼저 만들고 presignedUrl을 준다
 * 2) presignedUrl로 S3에 PUT
 * 2단계가 실패하면 이미지 없는 무드보드가 남는다 (SSR과 같은 구조) → 별도 에러로 알린다
 */
export const createMoodboard = async ({
  file,
  originalFilename,
  tagId,
}: CreateMoodboardParams) => {
  const imageExtension = file.name.includes('.')
    ? (file.name.split('.').pop() ?? '')
    : '';
  const { presignedUrl } = await postMoodboard(
    { imageExtension, originalFilename, tagId },
    file.type
  );
  if (!presignedUrl) {
    throw new Error('무드보드 업로드 URL 응답이 올바르지 않습니다.');
  }

  try {
    await putImageToPresignedUrl(presignedUrl, file, file.type);
  } catch {
    throw new MoodboardS3UploadError();
  }
};

export const useCreateMoodboardMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMoodboard,
    // 업로드 실패 메시지는 폼 안에 보여준다
    meta: { skipGlobalErrorToast: true },
    // S3 단계에서 실패해도 무드보드는 생겼으므로 목록은 항상 다시 받는다
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.moodboard.list() }),
  });
};
