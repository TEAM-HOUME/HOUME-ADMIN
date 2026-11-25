import type { AdminCurationRawProductResponse } from '@apis/__generated__/data-contracts';

import * as styles from './RawProductDetail.css';
import {
  formatDateTime,
  formatPrice,
  getFurnitureTagDisplayName,
} from '../../utils/rawProductForm';
import ChipList from '../chipList/ChipList';

interface RawProductDetailProps {
  product: AdminCurationRawProductResponse;
}

/** RAW 상품 상세 (SSR buildRawProductDetailHtml) */
function RawProductDetail({ product }: RawProductDetailProps) {
  const colorLabels = (product.colors ?? []).map(
    (color) => color.clientColorName || color.rawColorName || `ID:${color.id}`
  );
  const furnitureLabels = (product.furnitures ?? []).map(
    (furniture) =>
      `${furniture.furnitureTypeNameKr || '-'} / ${furniture.furnitureNameKr || '-'} (#${furniture.furnitureId})`
  );
  const tagLabels = (product.furnitureTags ?? []).map(
    (tag) =>
      `${tag.furnitureNameKr || '-'} / ${getFurnitureTagDisplayName(tag)} (#${tag.furnitureTagId})`
  );

  const meta: [string, string | number | undefined][] = [
    ['System ID', `#${product.id ?? '-'}`],
    ['Source', product.source],
    ['Category', product.category],
    ['External ID', product.productId],
  ];
  const prices: [string, string][] = [
    ['정가', `${formatPrice(product.listPrice)}원`],
    ['할인율', `${product.discountRate ?? 0}%`],
    ['할인가', `${formatPrice(product.discountPrice)}원`],
    ['배송비', `${formatPrice(product.baseShippingFee)}원`],
    ['무료배송 조건', `${formatPrice(product.freeShippingCondition)}원 이상`],
  ];

  return (
    <div>
      <div className={styles.header}>
        {product.productImageUrl ? (
          <img
            className={styles.image}
            src={product.productImageUrl}
            alt="상품 이미지"
          />
        ) : (
          <div className={styles.image} />
        )}
        <div>
          <h3 className={styles.title}>{product.productName || '이름 없음'}</h3>
          <p className={styles.sub}>
            {product.isExposed ? '서비스 노출 중' : '서비스 숨김'} ·{' '}
            {product.productMallName || '-'} · {product.brand || '-'}
          </p>
          <dl className={styles.grid}>
            {meta.map(([label, value]) => (
              <div key={label}>
                <dt className={styles.label}>{label}</dt>
                <dd className={styles.value}>{value ?? '-'}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className={styles.sections}>
        <section className={styles.panel}>
          <h4 className={styles.panelTitle}>가격 · 배송</h4>
          <dl className={styles.grid}>
            {prices.map(([label, value]) => (
              <div key={label}>
                <dt className={styles.label}>{label}</dt>
                <dd className={styles.value}>{value}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className={styles.panel}>
          <h4 className={styles.panelTitle}>링크 · 수집</h4>
          <div>
            <span className={styles.label}>Image URL</span>
            {product.productImageUrl ? (
              <a
                className={styles.link}
                href={product.productImageUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {product.productImageUrl}
              </a>
            ) : (
              <span className={styles.value}>정보 없음</span>
            )}
          </div>
          <div>
            <span className={styles.label}>Site URL</span>
            {product.productSiteUrl ? (
              <a
                className={styles.link}
                href={product.productSiteUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {product.productSiteUrl}
              </a>
            ) : (
              <span className={styles.value}>정보 없음</span>
            )}
          </div>
          <div>
            <span className={styles.label}>Last Fetched At</span>
            <span className={styles.value}>
              {formatDateTime(product.fetchedAt)}
            </span>
          </div>
        </section>
        <section className={styles.panel}>
          <h4 className={styles.panelTitle}>보유 컬러 속성</h4>
          <ChipList labels={colorLabels} emptyText="매핑된 컬러 없음" />
        </section>
        <section className={styles.panel}>
          <h4 className={styles.panelTitle}>연결된 하위가구 · 가구 태그</h4>
          <ChipList labels={furnitureLabels} emptyText="매핑된 하위가구 없음" />
          <ChipList labels={tagLabels} emptyText="매핑된 태그 없음" />
        </section>
      </div>
    </div>
  );
}

export default RawProductDetail;
