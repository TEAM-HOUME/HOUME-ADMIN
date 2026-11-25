import type { AdminCurationRawProductResponse } from '@apis/__generated__/data-contracts';

import * as ui from '@styles/adminUi.css';

import * as styles from './RawProductCard.css';
import {
  formatPrice,
  getFurnitureTagDisplayName,
} from '../../utils/rawProductForm';
import ChipList from '../chipList/ChipList';

interface RawProductCardProps {
  product: AdminCurationRawProductResponse;
  isChecked: boolean;
  isSelected: boolean;
  onCheck: (checked: boolean) => void;
  onDetail: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

/** 목록 카드 하나 (SSR buildRawProductCardHtml) */
function RawProductCard({
  product,
  isChecked,
  isSelected,
  onCheck,
  onDetail,
  onDelete,
  isDeleting,
}: RawProductCardProps) {
  const colorLabels = (product.colors ?? []).map(
    (color) => color.clientColorName || color.rawColorName || `ID:${color.id}`
  );
  const tagLabels = (product.furnitureTags ?? []).map(
    (tag) =>
      `${tag.furnitureNameKr || '-'} / ${getFurnitureTagDisplayName(tag)} (#${tag.furnitureTagId})`
  );
  const furnitureLabels = (product.furnitures ?? []).map(
    (furniture) =>
      `${furniture.furnitureTypeNameKr || '-'} / ${furniture.furnitureNameKr || '-'} (#${furniture.furnitureId})`
  );
  // SSR과 같이 Furniture Tag가 없으면 하위가구 매핑을 보여준다
  const mappingLabels = tagLabels.length > 0 ? tagLabels : furnitureLabels;

  return (
    <article
      className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
    >
      <div className={styles.top}>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => onCheck(e.target.checked)}
          aria-label={`RAW 상품 #${product.id} 선택`}
        />
        <div className={styles.thumb}>
          {product.productImageUrl ? (
            <img
              className={styles.thumbImage}
              src={product.productImageUrl}
              alt={`${product.productName ?? 'RAW 상품'} 이미지`}
              loading="lazy"
            />
          ) : (
            'NO IMAGE'
          )}
        </div>
        <div>
          <h3 className={styles.title} title={product.productName}>
            {product.productName || '이름 없음'}
          </h3>
          <p className={styles.subtitle}>
            {product.source || '-'} · {product.productMallName || '-'}
          </p>
          <span
            className={`${styles.badge} ${product.isExposed ? styles.exposed : styles.hidden}`}
          >
            {product.isExposed ? '노출' : '숨김'}
          </span>
        </div>
      </div>

      <dl className={styles.meta}>
        <div>
          <dt className={styles.metaLabel}>System ID</dt>
          <dd className={styles.metaValue}>#{product.id ?? '-'}</dd>
        </div>
        <div>
          <dt className={styles.metaLabel}>Category</dt>
          <dd className={styles.metaValue}>{product.category || '-'}</dd>
        </div>
        <div>
          <dt className={styles.metaLabel}>Price</dt>
          <dd className={styles.metaValue}>
            {formatPrice(product.discountPrice)}원
          </dd>
        </div>
      </dl>

      <div>
        <p className={styles.sectionLabel}>Colors</p>
        <ChipList labels={colorLabels} emptyText="없음" />
      </div>
      <div>
        <p className={styles.sectionLabel}>Tags</p>
        <ChipList labels={mappingLabels} emptyText="없음" />
      </div>

      <div className={ui.buttonRow}>
        <button className={ui.button.primary} type="button" onClick={onDetail}>
          상세
        </button>
        {product.productSiteUrl && (
          <a
            className={`${ui.button.secondary} ${styles.link}`}
            href={product.productSiteUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            링크
          </a>
        )}
        <button
          className={ui.button.danger}
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
        >
          삭제
        </button>
      </div>
    </article>
  );
}

export default RawProductCard;
