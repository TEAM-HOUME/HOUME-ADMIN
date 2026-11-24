/**
 * 어드민 토큰 저장소.
 *
 * 어드민 토큰은 24시간 유효하고 리프레시가 없다 (HOUME-SERVER PR #697).
 * 만료 시각을 같이 저장해, 이미 만료된 토큰으로 요청을 보내지 않게 한다.
 * 웹(HOUME-CLIENT)의 'accessToken' 키와 겹치지 않도록 키를 따로 쓴다.
 */
const TOKEN_KEY = 'houmeAdminAccessToken';
const EXPIRES_AT_KEY = 'houmeAdminAccessTokenExpiresAt';

export const saveAdminSession = (accessToken: string, expiresIn: number) => {
  const expiresAt = Date.now() + expiresIn * 1000;
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(EXPIRES_AT_KEY, String(expiresAt));
};

export const clearAdminSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRES_AT_KEY);
};

/** 유효한 토큰만 돌려준다. 만료됐으면 지우고 null */
export const getAdminAccessToken = (): string | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiresAt = Number(localStorage.getItem(EXPIRES_AT_KEY));

  if (!token || !Number.isFinite(expiresAt)) return null;
  if (Date.now() >= expiresAt) {
    clearAdminSession();
    return null;
  }
  return token;
};
