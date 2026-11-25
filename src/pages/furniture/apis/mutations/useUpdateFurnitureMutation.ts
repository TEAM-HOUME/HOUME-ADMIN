import { useMutation, useQueryClient } from '@tanstack/react-query';

import type {
  AdminFurnitureUpdateRequestDTO,
  AdminFurnitureUpdateResponseDTO,
} from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';
import { putImageToPresignedUrl } from '@apis/mutations/useImageUploadMutation';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

import { getFileExtension } from '@utils/getFileExtension';

export const patchFurniture = (
  body: AdminFurnitureUpdateRequestDTO,
  contentType?: string
) =>
  request<AdminFurnitureUpdateResponseDTO>({
    method: HTTPMethod.PATCH,
    url: API_ENDPOINT.FURNITURE.ITEM,
    query: contentType ? { contentType } : undefined,
    body,
  });

export type UpdateFurnitureParams = Omit<
  AdminFurnitureUpdateRequestDTO,
  'imageExtension'
> & { file?: File | null };

/**
 * 가구 정보 수정. 서버는 비어 있는(null·빈 문자열) 항목을 기존 값으로 유지한다.
 * 이미지를 함께 보내면 서버가 이미지 URL을 먼저 바꾸고 presignedUrl을 준다 → S3 PUT
 */
export const updateFurniture = async ({
  file,
  ...body
}: UpdateFurnitureParams) => {
  const { presignedUrl } = await patchFurniture(
    file ? { ...body, imageExtension: getFileExtension(file) } : body,
    file?.type
  );
  if (!file) return;

  if (!presignedUrl) {
    throw new Error(
      '정보는 수정됐지만 이미지 업로드 URL을 받지 못했습니다. 다시 시도해주세요.'
    );
  }
  try {
    await putImageToPresignedUrl(presignedUrl, file, file.type);
  } catch {
    throw new Error(
      '정보는 수정됐지만 대표 이미지 S3 업로드에 실패했습니다. 이미지를 다시 올려주세요.'
    );
  }
};

export const useUpdateFurnitureMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateFurniture,
    meta: { skipGlobalErrorToast: true },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.furniture.all }),
  });
};
