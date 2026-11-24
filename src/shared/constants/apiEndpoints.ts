export const API_ENDPOINT = {
  ADMIN: {
    LOGIN: '/api/v1/admin/login',
    /** 어드민 토큰 유효성 확인용. 성공하면 문자열을 돌려준다 */
    AUTH_CHECK: '/api/v1/admin/test',
  },
} as const;
