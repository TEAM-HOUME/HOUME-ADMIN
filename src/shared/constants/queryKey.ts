/**
 * 쿼리 키 factory. 도메인을 옮길 때마다 여기에 추가한다.
 * 키를 한곳에서 만들어야 invalidate할 때 오타로 캐시가 안 지워지는 일이 없다.
 */
export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    check: () => [...queryKeys.auth.all, 'check'] as const,
  },
  rawProduct: {
    all: ['rawProduct'] as const,
    search: (endpoint: string, keyword: string, size: number) =>
      [...queryKeys.rawProduct.all, 'search', endpoint, keyword, size] as const,
  },
  banner: {
    all: ['banner'] as const,
    list: () => [...queryKeys.banner.all, 'list'] as const,
  },
  landing: {
    all: ['landing'] as const,
    list: () => [...queryKeys.landing.all, 'list'] as const,
  },
  floorPlan: {
    all: ['floorPlan'] as const,
    list: () => [...queryKeys.floorPlan.all, 'list'] as const,
  },
  style: {
    all: ['style'] as const,
    list: () => [...queryKeys.style.all, 'list'] as const,
  },
  furniture: {
    all: ['furniture'] as const,
    list: () => [...queryKeys.furniture.all, 'list'] as const,
    prompt: (furnitureNameKr: string, tagId: number) =>
      [...queryKeys.furniture.all, 'prompt', furnitureNameKr, tagId] as const,
    forPlan: (params: object) =>
      [...queryKeys.furniture.all, 'forPlan', params] as const,
  },
  furnitureType: {
    all: ['furnitureType'] as const,
    list: () => [...queryKeys.furnitureType.all, 'list'] as const,
    furnitures: (furnitureTypeId: number) =>
      [...queryKeys.furnitureType.all, 'furnitures', furnitureTypeId] as const,
    tags: (furnitureTypeId: number) =>
      [...queryKeys.furnitureType.all, 'tags', furnitureTypeId] as const,
  },
  /** RAW 상품 관리(curation_raw_product). 배너·스타일의 RAW 상품 검색(rawProduct)과 별개 */
  curationRawProduct: {
    all: ['curationRawProduct'] as const,
    list: (params: object) =>
      [...queryKeys.curationRawProduct.all, 'list', params] as const,
    detail: (rawProductId: number) =>
      [...queryKeys.curationRawProduct.all, 'detail', rawProductId] as const,
    colorOptions: () =>
      [...queryKeys.curationRawProduct.all, 'colorOptions'] as const,
  },
  tag: {
    all: ['tag'] as const,
    list: () => [...queryKeys.tag.all, 'list'] as const,
  },
  moodboard: {
    all: ['moodboard'] as const,
    list: () => [...queryKeys.moodboard.all, 'list'] as const,
  },
  member: {
    all: ['member'] as const,
    search: (keyword: string) =>
      [...queryKeys.member.all, 'search', keyword] as const,
  },
} as const;
