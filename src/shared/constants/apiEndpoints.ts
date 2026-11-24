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
} as const;
