import type { AdminBannerMappedRawProductResponse } from '@apis/__generated__/data-contracts';

/**
 * RAW 상품 검색 결과·매핑 상품 (배너·스타일 공통 응답 타입).
 * 화면에서 고르거나 매핑할 때는 id가 반드시 있어야 한다.
 */
export type RawProduct = AdminBannerMappedRawProductResponse & {
  id: number;
};
