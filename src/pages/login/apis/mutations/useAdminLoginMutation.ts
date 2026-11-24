import { useMutation } from '@tanstack/react-query';

import type {
  AdminLoginRequestDTO,
  AdminLoginResponse,
} from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';

/**
 * 어드민 로그인. 요청의 `email` 필드에는 실제로 어드민 **아이디**가 들어간다.
 *
 * 생성 타입은 응답 필드가 전부 optional이라, 토큰이 빠진 응답은 여기서 실패로 처리한다.
 * 호출부는 `accessToken`·`expiresIn`이 있다고 믿고 쓸 수 있다.
 */
export const postAdminLogin = async (body: AdminLoginRequestDTO) => {
  const { accessToken, expiresIn } = await request<AdminLoginResponse>({
    method: HTTPMethod.POST,
    url: API_ENDPOINT.ADMIN.LOGIN,
    body,
  });

  if (!accessToken || expiresIn === undefined) {
    throw new Error('로그인 응답에 토큰이 없습니다.');
  }

  return { accessToken, expiresIn };
};

export const useAdminLoginMutation = () =>
  useMutation({
    mutationFn: postAdminLogin,
    // 실패 메시지는 로그인 폼 안에 보여준다
    meta: { skipGlobalErrorToast: true },
  });
