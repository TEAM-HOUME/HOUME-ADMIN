import type { RawProduct } from '@shared/types/rawProduct';

import RawProductSearch from '@components/rawProductSearch/RawProductSearch';

import * as ui from '@styles/adminUi.css';

import * as styles from './MappedRawProductPicker.css';

interface MappedRawProductPickerProps {
  /** 검색 API 경로 (API_ENDPOINT.*.RAW_PRODUCT_SEARCH) */
  searchEndpoint: string;
  value: RawProduct[];
  onChange: (next: RawProduct[]) => void;
  emptyText: string;
}

/**
 * '배너에 매핑된 가구' · '스타일에 매핑된 가구' 공통 섹션.
 * RAW 상품을 검색해 추가하고(중복은 '선택됨'), 태그의 ×로 뺀다.
 */
function MappedRawProductPicker({
  searchEndpoint,
  value,
  onChange,
  emptyText,
}: MappedRawProductPickerProps) {
  const add = (product: RawProduct) => {
    if (value.some(({ id }) => id === product.id)) return;
    onChange([...value, product]);
  };

  const remove = (productId: number) =>
    onChange(value.filter(({ id }) => id !== productId));

  return (
    <>
      <RawProductSearch
        label="RAW 상품 검색"
        searchEndpoint={searchEndpoint}
        size={12}
        selectLabel="추가"
        selectedIds={value.map(({ id }) => id)}
        onSelect={add}
      />
      {value.length > 0 ? (
        <div className={styles.tagList}>
          {value.map((product) => (
            <span key={product.id} className={ui.tag}>
              {product.productName} (#{product.id})
              <button
                className={ui.tagRemoveButton}
                type="button"
                aria-label="제거"
                onClick={() => remove(product.id)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className={ui.emptyText}>{emptyText}</p>
      )}
    </>
  );
}

export default MappedRawProductPicker;
