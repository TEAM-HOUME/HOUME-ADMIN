import { isAxiosError } from 'axios';

import type { BaseResponse } from '@shared/types/apis';

const DEFAULT_MESSAGE = '알 수 없는 오류가 발생했습니다.';

/**
 * 에러에서 사용자에게 보여줄 메시지를 꺼낸다.
 * 서버 에러 바디의 메시지 키가 `msg`(ApiResponse)와 `message`(JWTFilter) 두 가지라 둘 다 본다.
 */
export const getApiErrorMessage = (
  error: unknown,
  fallback: string = DEFAULT_MESSAGE
): string => {
  if (isAxiosError<Partial<BaseResponse<unknown>>>(error)) {
    const data = error.response?.data;
    return data?.msg ?? data?.message ?? fallback;
  }
  return fallback;
};
