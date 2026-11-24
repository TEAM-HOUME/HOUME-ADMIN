import { useMutation } from '@tanstack/react-query';

import { HTTPMethod, request } from '@apis/config/request';

import { validateImageFile } from '@utils/validateImageFile';

/** 배너·랜딩·스타일·도면의 `image-upload-url` 응답은 모양이 같다 */
interface ImageUploadUrlResponse {
  uploadUrl?: string;
  publicUrl?: string;
}

export const postImageUploadUrl = (
  endpoint: string,
  contentType: string,
  imageExtension: string
) =>
  request<ImageUploadUrlResponse>({
    method: HTTPMethod.POST,
    url: endpoint,
    query: { contentType },
    body: { imageExtension },
  });

/**
 * presigned URL로 S3에 파일을 올린다.
 * 외부(S3) 호출이라 request()·axiosInstance를 쓰지 않는다 —
 * Authorization 헤더나 baseURL이 붙으면 서명이 깨진다.
 */
export const putImageToPresignedUrl = async (
  uploadUrl: string,
  file: File,
  contentType: string
) => {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: file,
  });
  if (!response.ok) {
    throw new Error('S3 이미지 업로드에 실패했습니다.');
  }
};

/**
 * 공통 이미지 업로드 (배너·랜딩·스타일·도면).
 * 1) `POST {endpoint}?contentType=` + `{ imageExtension }` → uploadUrl, publicUrl
 * 2) uploadUrl에 파일 PUT
 * 3) publicUrl을 돌려준다 → 생성·수정 API에 넘긴다
 *
 * 무드보드·가구 프롬프트는 등록 API가 presignedUrl을 바로 주는 다른 방식이라 여기서 다루지 않는다.
 */
export const uploadImage = async (endpoint: string, file: File) => {
  const validation = validateImageFile(file);
  if (!validation.ok) {
    throw new Error(validation.message);
  }

  const { uploadUrl, publicUrl } = await postImageUploadUrl(
    endpoint,
    validation.contentType,
    validation.extension
  );
  if (!uploadUrl || !publicUrl) {
    throw new Error('이미지 업로드 URL 응답이 올바르지 않습니다.');
  }

  await putImageToPresignedUrl(uploadUrl, file, validation.contentType);
  return publicUrl;
};

export const useImageUploadMutation = (endpoint: string) =>
  useMutation({
    mutationFn: (file: File) => uploadImage(endpoint, file),
    // 업로드 실패 메시지는 업로드 필드 안에 보여준다
    meta: { skipGlobalErrorToast: true },
  });
