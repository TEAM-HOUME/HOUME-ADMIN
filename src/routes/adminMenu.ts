import { ROUTES, type RoutePath } from '@routes/paths';

export interface AdminMenuItem {
  label: string;
  /** 아직 옮기지 않은 화면은 path가 없다 → 메뉴에서 비활성으로 보인다 */
  path?: RoutePath;
}

/**
 * 사이드바 메뉴. 순서와 이름은 서버 SSR 대시보드(templates/admin/dashboard.html)의 탭을 따른다.
 * 화면을 옮길 때 ROUTES에 경로를 추가하고 여기 path를 채운다 (docs/migration-checklist.md).
 */
export const ADMIN_MENU: AdminMenuItem[] = [
  { label: '홈', path: ROUTES.HOME },
  { label: '가구 관리', path: ROUTES.FURNITURE },
  { label: '가구 타입 관리', path: ROUTES.FURNITURE_TYPE },
  { label: '태그 관리', path: ROUTES.TAG },
  { label: '무드보드 관리', path: ROUTES.MOODBOARD },
  { label: 'RAW 상품 관리', path: ROUTES.RAW_PRODUCT },
  { label: '랜딩 관리', path: ROUTES.LANDING },
  { label: '배너 관리', path: ROUTES.BANNER },
  { label: '스타일로 시작하기 관리', path: ROUTES.STYLE },
  { label: '도면 관리', path: ROUTES.FLOOR_PLAN },
  { label: '회원 크레딧 추가', path: ROUTES.CREDIT },
  { label: '가격비교 검색', path: ROUTES.COMPARE_SEARCH },
  { label: '프리셋 관리', path: ROUTES.COMPARE_PRESET },
  { label: '검색어 검증', path: ROUTES.KEYWORD_CHECK },
];
