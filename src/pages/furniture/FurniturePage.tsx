import { useState } from 'react';

import * as ui from '@styles/adminUi.css';

import { getApiErrorMessage } from '@utils/getApiErrorMessage';

import { useFurnitureListQuery } from './apis/queries/useFurnitureListQuery';
import ForPlanSearch from './components/forPlanSearch/ForPlanSearch';
import FurnitureCreateForm from './components/furnitureCreateForm/FurnitureCreateForm';
import FurniturePromptCreateForm from './components/furniturePromptCreateForm/FurniturePromptCreateForm';
import FurniturePromptLookup from './components/furniturePromptLookup/FurniturePromptLookup';
import FurnitureTable from './components/furnitureTable/FurnitureTable';
import FurnitureUpdateForm from './components/furnitureUpdateForm/FurnitureUpdateForm';

import type { FurnitureTagSelection } from './utils/furnitureForm';

/** 가구 관리 — SSR 대시보드 '가구 관리' 탭 */
function FurniturePage() {
  const {
    data: furnitures,
    isPending,
    error,
    refetch,
    isFetching,
  } = useFurnitureListQuery();
  const [selection, setSelection] = useState<FurnitureTagSelection | null>(
    null
  );
  // 같은 연결을 다시 고르거나 초기화해도 수정 폼이 새로 만들어지도록 key에 섞는다
  const [formVersion, setFormVersion] = useState(0);
  const [isListVisible, setIsListVisible] = useState(true);

  const select = (next: FurnitureTagSelection | null) => {
    setSelection(next);
    setFormVersion((prev) => prev + 1);
  };

  const startEdit = (next: FurnitureTagSelection) => {
    select(next);
    document
      .getElementById('furniture-update-form')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const renderList = () => {
    if (isPending) return <p className={ui.emptyText}>불러오는 중...</p>;
    if (error) {
      return (
        <p className={ui.errorText} role="alert">
          {getApiErrorMessage(error, '가구 목록을 불러오지 못했습니다.')}
        </p>
      );
    }
    return (
      <FurnitureTable
        furnitures={furnitures}
        selection={selection}
        onEdit={startEdit}
        onDeleted={({ furnitureNameKr, tagId }) => {
          const isSelectedRemoved =
            selection?.furnitureNameKr === furnitureNameKr &&
            (tagId === undefined || selection.tagId === tagId);
          if (isSelectedRemoved) select(null);
        }}
      />
    );
  };

  return (
    <>
      <h2 className={ui.pageTitle}>가구 관리</h2>

      <section className={ui.card}>
        <div className={ui.cardHeader}>
          등록된 가구
          <div className={ui.buttonRow}>
            <button
              className={ui.button.secondary}
              type="button"
              onClick={() => setIsListVisible((prev) => !prev)}
            >
              {isListVisible ? '가구 목록 숨기기' : '가구 목록 보기'}
            </button>
            <button
              className={ui.button.secondary}
              type="button"
              onClick={() => {
                setIsListVisible(true);
                void refetch();
              }}
              disabled={isFetching}
            >
              가구 목록 새로고침
            </button>
          </div>
        </div>
        {isListVisible && <div className={ui.cardBody}>{renderList()}</div>}
      </section>

      <section className={ui.card}>
        <div className={ui.cardHeader}>신규 가구 등록</div>
        <div className={ui.cardBody}>
          <FurnitureCreateForm />
        </div>
      </section>

      <section className={ui.card}>
        <div className={ui.cardHeader}>가구 프롬프트 등록</div>
        <div className={ui.cardBody}>
          <FurniturePromptCreateForm />
        </div>
      </section>

      <section className={ui.card} id="furniture-update-form">
        <div className={ui.cardHeader}>
          {selection
            ? `가구 정보 수정 (${selection.furnitureNameKr} · 태그 ${selection.tagId})`
            : '가구 정보 수정'}
        </div>
        <div className={ui.cardBody}>
          <FurnitureUpdateForm
            key={`${selection?.furnitureNameKr ?? ''}-${selection?.tagId ?? 'none'}-${formVersion}`}
            selection={selection}
            onReset={() => select(null)}
          />
        </div>
      </section>

      <section className={ui.card}>
        <div className={ui.cardHeader}>프롬프트 조회</div>
        <div className={ui.cardBody}>
          <FurniturePromptLookup />
        </div>
      </section>

      <section className={ui.card}>
        <div className={ui.cardHeader}>
          [기획 의사결정용] 가구 제품 조회 (for-plan)
        </div>
        <div className={ui.cardBody}>
          <ForPlanSearch version="v1" />
        </div>
      </section>

      <section className={ui.card}>
        <div className={ui.cardHeader}>
          [기획 의사결정용 V2] 가구 제품 조회 (mall / NPay 필터)
        </div>
        <div className={ui.cardBody}>
          <ForPlanSearch version="v2" />
        </div>
      </section>
    </>
  );
}

export default FurniturePage;
