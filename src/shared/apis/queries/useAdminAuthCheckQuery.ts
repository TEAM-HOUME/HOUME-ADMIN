import { useQuery } from '@tanstack/react-query';

import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

export const getAdminAuthCheck = () =>
  request<string>({
    method: HTTPMethod.GET,
    url: API_ENDPOINT.ADMIN.AUTH_CHECK,
  });

/**
 * 저장된 토큰이 서버에서도 유효한 어드민 토큰인지 확인한다.
 * 실패(401·403·40002 등)하면 axiosInstance가 토큰을 지우고 로그인 화면으로 보낸다.
 */
export const useAdminAuthCheckQuery = () =>
  useQuery({
    queryKey: queryKeys.auth.check(),
    queryFn: getAdminAuthCheck,
    staleTime: Infinity,
  });
