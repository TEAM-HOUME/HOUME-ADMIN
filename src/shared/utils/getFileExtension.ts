/**
 * 파일 이름의 마지막 '.' 뒤 확장자. 점이 없으면 빈 문자열.
 * presignedUrl 방식 등록 API(무드보드 · 가구 프롬프트)의 imageExtension에 쓴다.
 */
export const getFileExtension = (file: File) =>
  file.name.includes('.') ? (file.name.split('.').pop() ?? '') : '';
