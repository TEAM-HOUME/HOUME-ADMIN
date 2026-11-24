/**
 * 서버 image-upload-url API가 받는 확장자 (`@pattern ^(?i)(jpg|jpeg|png|gif|webp)$`)와
 * 각 확장자에 맞는 MIME 타입. SSR 대시보드의 ALLOWED_IMAGE_* 상수와 같다.
 */
const IMAGE_CONTENT_TYPES = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
} as const;

type ImageExtension = keyof typeof IMAGE_CONTENT_TYPES;

const isImageExtension = (value: string): value is ImageExtension =>
  Object.hasOwn(IMAGE_CONTENT_TYPES, value);

export type ImageFileValidation =
  | { ok: true; extension: ImageExtension; contentType: string }
  | { ok: false; message: string };

/** 확장자와 MIME 타입이 둘 다 허용 목록에 있고 서로 맞는지 확인한다 */
export const validateImageFile = (file: File): ImageFileValidation => {
  const extension = file.name.includes('.')
    ? (file.name.split('.').pop() ?? '').toLowerCase()
    : '';

  if (!extension) {
    return { ok: false, message: '파일 확장자를 확인할 수 없습니다.' };
  }
  if (!isImageExtension(extension)) {
    return {
      ok: false,
      message:
        'jpg, jpeg, png, gif, webp 형식의 이미지만 업로드할 수 있습니다.',
    };
  }

  const contentType = IMAGE_CONTENT_TYPES[extension];
  if (file.type.toLowerCase() !== contentType) {
    return {
      ok: false,
      message: '선택한 파일의 확장자와 MIME 타입이 올바르지 않습니다.',
    };
  }

  return { ok: true, extension, contentType };
};
