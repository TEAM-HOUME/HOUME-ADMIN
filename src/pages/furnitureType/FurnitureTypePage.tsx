import { useState } from 'react';

import type { AdminFurnitureTypeResponse } from '@apis/__generated__/data-contracts';
import { useFurnitureTypeListQuery } from '@apis/queries/useFurnitureTypeListQuery';

import * as ui from '@styles/adminUi.css';

import { getApiErrorMessage } from '@utils/getApiErrorMessage';

import FurnitureTypeCreateForm from './components/furnitureTypeCreateForm/FurnitureTypeCreateForm';
import FurnitureTypeTable from './components/furnitureTypeTable/FurnitureTypeTable';
import FurnitureTypeUpdateForm from './components/furnitureTypeUpdateForm/FurnitureTypeUpdateForm';

/** 가구 타입 관리 — SSR 대시보드 '가구 타입 관리' 탭 */
function FurnitureTypePage() {
  const {
    data: furnitureTypes,
    isPending,
    error,
    refetch,
    isFetching,
  } = useFurnitureTypeListQuery();
  const [selectedType, setSelectedType] =
    useState<AdminFurnitureTypeResponse | null>(null);
  // 같은 타입을 다시 고르거나 초기화해도 수정 폼이 새로 만들어지도록 key에 섞는다
  const [formVersion, setFormVersion] = useState(0);

  const selectType = (type: AdminFurnitureTypeResponse | null) => {
    setSelectedType(type);
    setFormVersion((prev) => prev + 1);
  };

  const startEdit = (type: AdminFurnitureTypeResponse) => {
    selectType(type);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const renderList = () => {
    if (isPending) return <p className={ui.emptyText}>불러오는 중...</p>;
    if (error) {
      return (
        <p className={ui.errorText} role="alert">
          {getApiErrorMessage(error, '가구 타입 목록을 불러오지 못했습니다.')}
        </p>
      );
    }
    return (
      <FurnitureTypeTable
        furnitureTypes={furnitureTypes}
        selectedTypeId={selectedType?.furnitureTypeId}
        onEdit={startEdit}
        onDeleted={(typeId) => {
          if (selectedType?.furnitureTypeId === typeId) selectType(null);
        }}
      />
    );
  };

  return (
    <>
      <h2 className={ui.pageTitle}>가구 타입 관리</h2>

      <section className={ui.card}>
        <div className={ui.cardHeader}>
          등록된 가구 타입
          <button
            className={ui.button.secondary}
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
          >
            가구 타입 목록 새로고침
          </button>
        </div>
        <div className={ui.cardBody}>{renderList()}</div>
      </section>

      <section className={ui.card}>
        <div className={ui.cardHeader}>신규 가구 타입 등록</div>
        <div className={ui.cardBody}>
          <FurnitureTypeCreateForm />
        </div>
      </section>

      <section className={ui.card}>
        <div className={ui.cardHeader}>
          {selectedType
            ? `가구 타입 정보 수정 (#${selectedType.furnitureTypeId})`
            : '가구 타입 정보 수정'}
        </div>
        <div className={ui.cardBody}>
          <FurnitureTypeUpdateForm
            key={`${selectedType?.furnitureTypeId ?? 'none'}-${formVersion}`}
            selectedType={selectedType}
            onReset={() => selectType(null)}
          />
        </div>
      </section>
    </>
  );
}

export default FurnitureTypePage;
