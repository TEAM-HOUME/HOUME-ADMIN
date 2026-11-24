// 전역에서 사용하는 "경로 상수" 모음입니다.
// 도메인 화면을 옮길 때마다 여기에 추가합니다.
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  BANNER: '/banners',
  LANDING: '/landings',
  FLOOR_PLAN: '/floor-plans',
  STYLE: '/styles',
  CREDIT: '/credits',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
