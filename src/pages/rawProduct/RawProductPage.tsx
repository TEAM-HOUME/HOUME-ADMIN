import { useState } from 'react';

import * as ui from '@styles/adminUi.css';

import { getApiErrorMessage } from '@utils/getApiErrorMessage';

import { useRawProductDetailQuery } from './apis/queries/useRawProductDetailQuery';
import RawProductCreateForm from './components/rawProductCreateForm/RawProductCreateForm';
import RawProductDangerZone from './components/rawProductDangerZone/RawProductDangerZone';
import RawProductDetail from './components/rawProductDetail/RawProductDetail';
import RawProductList from './components/rawProductList/RawProductList';
import RawProductLookup from './components/rawProductLookup/RawProductLookup';
import RawProductMappingPanel from './components/rawProductMappingPanel/RawProductMappingPanel';
import RawProductUpdateForm from './components/rawProductUpdateForm/RawProductUpdateForm';
import * as styles from './RawProductPage.css';

const WORKSPACE_ID = 'raw-product-workspace';

/** RAW 상품 관리(큐레이션 원본 상품) — SSR 대시보드 'RAW 상품 관리' 탭 */
function RawProductPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const {
    data: product,
    isPending,
    error,
    dataUpdatedAt,
  } = useRawProductDetailQuery(selectedId);

  const openDetail = (rawProductId: number) => {
    setSelectedId(rawProductId);
    document
      .getElementById(WORKSPACE_ID)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDeleted = (rawProductId: number) => {
    if (rawProductId === selectedId) setSelectedId(null);
  };

  const loadedProduct =
    product?.id !== undefined ? { ...product, id: product.id } : null;

  const renderMain = () => {
    if (selectedId === null) {
      return (
        <p className={ui.emptyText}>
          목록에서 &quot;상세&quot;를 누르거나 오른쪽에서 상품 ID로 찾아
          관리하세요.
        </p>
      );
    }
    if (isPending) return <p className={ui.emptyText}>불러오는 중...</p>;
    if (error || !loadedProduct) {
      return (
        <p className={ui.errorText} role="alert">
          {getApiErrorMessage(error, 'RAW 상품 상세를 불러오지 못했습니다.')}
        </p>
      );
    }
    return <RawProductDetail product={loadedProduct} />;
  };

  return (
    <>
      <div className={styles.header}>
        <div>
          <h2 className={ui.pageTitle}>RAW 상품 관리</h2>
        </div>
        <button
          className={ui.button.primary}
          type="button"
          onClick={() => setIsCreateOpen((prev) => !prev)}
        >
          {isCreateOpen ? '등록 닫기' : '새 RAW 상품 등록'}
        </button>
      </div>
      <p className={ui.helperText}>
        원천 데이터 수집 현황을 파악하고, 서비스 노출 및 가구 속성을 매핑합니다.
      </p>

      {isCreateOpen && (
        <section className={ui.card}>
          <div className={ui.cardHeader}>신규 RAW 상품 등록</div>
          <div className={ui.cardBody}>
            <RawProductCreateForm onCancel={() => setIsCreateOpen(false)} />
          </div>
        </section>
      )}

      <section className={ui.card}>
        <div className={ui.cardHeader}>RAW 상품 검색 및 목록</div>
        <div className={ui.cardBody}>
          <RawProductList
            selectedProductId={selectedId}
            onDetail={openDetail}
            onDeleted={handleDeleted}
          />
        </div>
      </section>

      <div className={styles.workspace} id={WORKSPACE_ID}>
        <div>
          <section className={ui.card}>
            <div className={ui.cardHeader}>
              {selectedId !== null ? `상품 상세 (#${selectedId})` : '상품 상세'}
            </div>
            <div className={ui.cardBody}>{renderMain()}</div>
          </section>
          {loadedProduct && (
            <section className={ui.card}>
              <div className={ui.cardHeader}>선택 상품 정보 수정</div>
              <div className={ui.cardBody}>
                {/* 상세가 새로 오면(매핑 변경 · 저장 후) 폼도 서버 값으로 다시 채운다 */}
                <RawProductUpdateForm
                  key={`${loadedProduct.id}-${dataUpdatedAt}`}
                  product={loadedProduct}
                />
              </div>
            </section>
          )}
        </div>

        <div>
          <section className={ui.card}>
            <div className={ui.cardHeader}>상품 ID로 바로 찾기</div>
            <div className={ui.cardBody}>
              <RawProductLookup onLookup={openDetail} />
            </div>
          </section>
          {loadedProduct && (
            <section className={ui.card}>
              <div className={ui.cardHeader}>가구 태그 매핑</div>
              <div className={ui.cardBody}>
                <RawProductMappingPanel
                  key={loadedProduct.id}
                  product={loadedProduct}
                />
              </div>
            </section>
          )}
          <section className={`${ui.card} ${styles.dangerCard}`}>
            <div className={ui.cardHeader}>위험 구역 — RAW 상품 영구 삭제</div>
            <div className={ui.cardBody}>
              <RawProductDangerZone
                key={selectedId ?? 'none'}
                defaultId={selectedId}
                onDeleted={handleDeleted}
              />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default RawProductPage;
