import axios, { AxiosError } from 'axios';

import type { BaseResponse } from '@shared/types/apis';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { SESSION_INVALID_CODES } from '@constants/apiErrorCode';

import { clearAdminSession, getAdminAccessToken } from './adminSession';
import { redirectToLogin } from './redirectToLogin';

/**
 * 어드민 전용 axios 인스턴스.
 *
 * 웹(HOUME-CLIENT)과 다른 점:
 * - 리프레시 토큰이 없다 → `/reissue` 재발급 로직이 없다
 * - 쿠키를 쓰지 않는다 → `withCredentials` 없음
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 인증 없이 호출하는 API
const EXCLUDE_AUTH_URLS: string[] = [API_ENDPOINT.ADMIN.LOGIN];

axiosInstance.interceptors.request.use((config) => {
  const isExcluded = EXCLUDE_AUTH_URLS.includes(config.url ?? '');
  const accessToken = getAdminAccessToken();

  if (!isExcluded && accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

/**
 * 세션이 끝난 응답인지 판단한다.
 * - 401: 무효 토큰(40103)·어드민 계정 없음(40104)
 * - 403: 토큰 없음·어드민 아님 (바디 없음)
 * - 40002: 토큰 만료 — HTTP 400으로 온다
 */
const isSessionInvalid = (
  error: AxiosError<Partial<BaseResponse<unknown>>>
) => {
  const status = error.response?.status;
  const code = error.response?.data?.code;

  if (status === 401 || status === 403) return true;
  return code !== undefined && SESSION_INVALID_CODES.includes(code);
};

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<Partial<BaseResponse<unknown>>>) => {
    // 로그인 실패(40401)는 로그인 화면에서 메시지로 보여준다
    const isLoginRequest = error.config?.url === API_ENDPOINT.ADMIN.LOGIN;

    if (!isLoginRequest && isSessionInvalid(error)) {
      clearAdminSession();
      void redirectToLogin();
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
