/**
 * 서버 공통 응답 포맷.
 *
 * - 일반 응답·에러: `ApiResponse` → `{ code, msg, data, traceId? }`
 * - JWTFilter 에러(토큰 만료·무효): `{ code, message, traceId }` — 키가 `message`다
 * - 403(토큰 없음·어드민 아님): 바디 없음
 *
 * 그래서 메시지는 `msg`와 `message`를 둘 다 optional로 두고 `getApiErrorMessage()`로 읽는다.
 */
export interface BaseResponse<T> {
  code: number;
  msg?: string;
  message?: string;
  data: T;
  traceId?: string;
}
