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
  FURNITURE: {
    LIST: '/api/v1/admin/furnitures',
    /** 등록(POST) · 정보 수정(PATCH ?contentType=) · 삭제(DELETE, body에 furnitureNameKr) 공용 경로 */
    ITEM: '/api/v1/admin/furniture',
    /** 프롬프트 등록(POST ?contentType=, presignedUrl 반환) · 조회(GET ?furnitureNameKr=&tagId=) */
    PROMPT: '/api/v1/admin/furniture/prompt',
    /** 가구-태그 연결 삭제 (DELETE, body에 furnitureNameKr · tagId) */
    TAG: '/api/v1/admin/furniture/tag',
  },
  /** 기획 의사결정용 제품 조회 — 어드민 경로가 아니지만 어드민 토큰으로 호출 가능 (userName은 null) */
  FOR_PLAN: {
    V1: (tagId: number, furnitureId: number) =>
      `/api/v1/generated-images/${tagId}/curations/products/${furnitureId}/for-plan`,
    V2: (tagId: number, furnitureId: number) =>
      `/api/v1/generated-images/${tagId}/curations/products/${furnitureId}/for-plan/detail`,
  },
  RAW_PRODUCT: {
    LIST: '/api/v1/admin/curation-raw-products',
    DETAIL: (rawProductId: number) =>
      `/api/v1/admin/curation-raw-products/${rawProductId}`,
    COLOR_OPTIONS: '/api/v1/admin/curation-raw-products/color-options',
    EXPOSURE: '/api/v1/admin/curation-raw-products/exposure',
    MAPPINGS: (rawProductId: number) =>
      `/api/v1/admin/curation-raw-products/${rawProductId}/furniture-tags`,
    MAPPING: (rawProductId: number, mappingId: number) =>
      `/api/v1/admin/curation-raw-products/${rawProductId}/furniture-tags/${mappingId}`,
  },
  FURNITURE_TYPE: {
    LIST: '/api/v1/admin/furniture/types',
    /** 타입별 하위 가구 (RAW 상품 하위가구 매핑에서 사용) */
    FURNITURES: (furnitureTypeId: number) =>
      `/api/v1/admin/furniture/types/${furnitureTypeId}/furnitures`,
    /** 타입별 furniture_tag (RAW 상품 Furniture Tag 매핑에서 사용) */
    TAGS: (furnitureTypeId: number) =>
      `/api/v1/admin/furniture/types/${furnitureTypeId}/tags`,
    /** 등록(POST) · 수정(PATCH, body에 id) · 삭제(DELETE, body에 furnitureTypeId) 공용 경로 */
    ITEM: '/api/v1/admin/furniture/type',
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
