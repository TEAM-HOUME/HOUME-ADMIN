/** 서버 ErrorCode 중 어드민 클라이언트가 분기하는 코드 (HOUME-SERVER PR #697 기준) */
export const ERROR_CODES = {
  /** 토큰 만료. HTTP 400으로 온다 */
  ACCESS_TOKEN_EXPIRED: 40002,
  /** 입력값 검증 실패 */
  INVALID_INPUT: 40008,
  /** 유효하지 않은 어드민 토큰 (배포 전 발급된 레거시 토큰 등) */
  INVALID_ADMIN_TOKEN: 40103,
  /** 토큰의 어드민 계정이 없음 */
  ADMIN_NOT_FOUND: 40104,
  /** 로그인 실패 (아이디·비밀번호 불일치). HTTP 404로 온다 */
  LOGIN_FAILED: 40401,
} as const;

/** 이 코드가 오면 토큰을 버리고 로그인 화면으로 보낸다 */
export const SESSION_INVALID_CODES: readonly number[] = [
  ERROR_CODES.ACCESS_TOKEN_EXPIRED,
  ERROR_CODES.INVALID_ADMIN_TOKEN,
  ERROR_CODES.ADMIN_NOT_FOUND,
];
