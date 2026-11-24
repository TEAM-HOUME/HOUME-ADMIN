import { useMutation } from '@tanstack/react-query';

import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';

// TODO: pnpm api:generate 후 __generated__/data-contracts.ts의 타입으로 교체
// 서버 AdminLoginRequestDTO · AdminLoginResponse (HOUME-SERVER PR #697) 기준
interface AdminLoginRequest {
  /** 필드 이름은 email이지만 실제로는 어드민 아이디 */
  email: string;
  password: string;
}

interface AdminLoginResponse {
  accessToken: string;
  /** 토큰 유효 시간(초). 기본 86400 */
  expiresIn: number;
}

export const postAdminLogin = (body: AdminLoginRequest) =>
  request<AdminLoginResponse>({
    method: HTTPMethod.POST,
    url: API_ENDPOINT.ADMIN.LOGIN,
    body,
  });

export const useAdminLoginMutation = () =>
  useMutation({
    mutationFn: postAdminLogin,
    // 실패 메시지는 로그인 폼 안에 보여준다
    meta: { skipGlobalErrorToast: true },
  });
