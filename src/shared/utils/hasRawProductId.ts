import type { RawProduct } from '@shared/types/rawProduct';

import type { AdminBannerMappedRawProductResponse } from '@apis/__generated__/data-contracts';

/** 생성 타입은 id가 optional이라, id가 있는 상품만 골라낼 때 쓴다 */
export const hasRawProductId = (
  product: AdminBannerMappedRawProductResponse
): product is RawProduct => product.id !== undefined;
