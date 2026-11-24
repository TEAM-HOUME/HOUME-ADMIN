import { useState, type KeyboardEvent } from 'react';

import type { RawProduct } from '@shared/types/rawProduct';

import { useRawProductSearchQuery } from '@apis/queries/useRawProductSearchQuery';

import * as ui from '@styles/adminUi.css';

import { getApiErrorMessage } from '@utils/getApiErrorMessage';
import { hasRawProductId } from '@utils/hasRawProductId';

import * as styles from './RawProductSearch.css';

interface RawProductSearchProps {
  label: string;
  /** 검색 API 경로 — 배너·스타일이 각자 경로를 쓴다 (API_ENDPOINT.*.RAW_PRODUCT_SEARCH) */
  searchEndpoint: string;
  /** 한 번에 받아올 결과 수. SSR 기준 칩 8개, 매핑 가구 12개 */
  size: number;
  /** 이미 고른 상품 id. 결과에서 '선택됨'으로 비활성 처리한다 */
  selectedIds?: number[];
  selectLabel?: string;
  /** 고른 뒤 결과 목록을 닫을지 (칩은 하나만 고르므로 닫는다) */
  closeOnSelect?: boolean;
  onSelect: (product: RawProduct) => void;
}

/** RAW 상품 검색 입력 + 결과 목록. 고른 상품은 onSelect로 넘긴다 */
function RawProductSearch({
  label,
  searchEndpoint,
  size,
  selectedIds = [],
  selectLabel = '선택',
  closeOnSelect = false,
  onSelect,
}: RawProductSearchProps) {
  const [keyword, setKeyword] = useState('');
  const [submittedKeyword, setSubmittedKeyword] = useState('');
  const [isEmptyKeyword, setIsEmptyKeyword] = useState(false);
  const {
    data: rawProducts,
    isFetching,
    error,
  } = useRawProductSearchQuery(searchEndpoint, submittedKeyword, size);

  const search = () => {
    const trimmed = keyword.trim();
    setIsEmptyKeyword(trimmed === '');
    setSubmittedKeyword(trimmed);
  };

  // 폼 안에 있으므로 Enter가 폼 제출로 이어지지 않게 막고 검색만 한다
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    search();
  };

  const handleSelect = (product: RawProduct) => {
    onSelect(product);
    if (closeOnSelect) setSubmittedKeyword('');
  };

  const renderResults = () => {
    if (isEmptyKeyword) {
      return <p className={ui.emptyText}>검색어를 입력해주세요.</p>;
    }
    if (!submittedKeyword) return null;
    if (isFetching) return <p className={ui.emptyText}>검색 중...</p>;
    if (error) {
      return (
        <p className={ui.errorText} role="alert">
          {getApiErrorMessage(error)}
        </p>
      );
    }

    const products = (rawProducts ?? []).filter(hasRawProductId);
    if (products.length === 0) {
      return <p className={ui.emptyText}>검색 결과가 없습니다.</p>;
    }

    return (
      <ul className={styles.resultList}>
        {products.map((product) => {
          const isSelected = selectedIds.includes(product.id);
          return (
            <li key={product.id} className={styles.resultItem}>
              <div>
                <p className={styles.productName}>{product.productName}</p>
                <p className={styles.productMeta}>
                  {product.source ?? '-'} · productId {product.productId ?? '-'}{' '}
                  · raw #{product.id}
                </p>
              </div>
              <button
                className={ui.button.secondary}
                type="button"
                disabled={isSelected}
                onClick={() => handleSelect(product)}
              >
                {isSelected ? '선택됨' : selectLabel}
              </button>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className={ui.field}>
      {label}
      <div className={styles.searchRow}>
        <input
          className={ui.input}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="상품명, 브랜드, source, productId 검색"
        />
        <button className={ui.button.secondary} type="button" onClick={search}>
          검색
        </button>
      </div>
      {renderResults()}
    </div>
  );
}

export default RawProductSearch;
