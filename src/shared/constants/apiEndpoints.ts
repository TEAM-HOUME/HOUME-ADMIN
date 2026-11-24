export const API_ENDPOINT = {
  ADMIN: {
    LOGIN: '/api/v1/admin/login',
    /** 어드민 토큰 유효성 확인용. 성공하면 문자열을 돌려준다 */
    AUTH_CHECK: '/api/v1/admin/test',
  },
  BANNER: {
    LIST: '/api/v1/admin/banners',
    DETAIL: (bannerId: number) => `/api/v1/admin/banners/${bannerId}`,
    IMAGE_UPLOAD_URL: '/api/v1/admin/banners/image-upload-url',
    RAW_PRODUCT_SEARCH: '/api/v1/admin/banners/raw-products/search',
  },
  LANDING: {
    LIST: '/api/v1/admin/landings',
    DETAIL: (landingId: number) => `/api/v1/admin/landings/${landingId}`,
    IMAGE_UPLOAD_URL: '/api/v1/admin/landings/image-upload-url',
  },
  FLOOR_PLAN: {
    LIST: '/api/v1/admin/floor-plans',
    DETAIL: (floorPlanId: number) => `/api/v1/admin/floor-plans/${floorPlanId}`,
    IMAGE_UPLOAD_URL: '/api/v1/admin/floor-plans/image-upload-url',
  },
  STYLE: {
    LIST: '/api/v1/admin/styles',
    DETAIL: (styleId: number) => `/api/v1/admin/styles/${styleId}`,
    IMAGE_UPLOAD_URL: '/api/v1/admin/styles/image-upload-url',
    RAW_PRODUCT_SEARCH: '/api/v1/admin/styles/raw-products/search',
  },
  TAG: {
    LIST: '/api/v1/admin/tags',
    /** 생성(POST) · 수정(PATCH) · 삭제(DELETE, body에 tagId) 공용 경로 */
    ITEM: '/api/v1/admin/tag',
  },
  MOODBOARD: {
    LIST: '/api/v1/admin/moodboards',
    /** 등록(POST ?contentType=, presignedUrl 반환) · 삭제(DELETE ?filename=) 공용 경로 */
    ITEM: '/api/v1/admin/moodboard',
  },
  MEMBER: {
    /** 이메일 완전일치 또는 닉네임 부분검색 (?keyword=) */
    SEARCH: '/api/v1/admin/members',
    CREDITS: (memberId: number) => `/api/v1/admin/members/${memberId}/credits`,
  },
} as const;
