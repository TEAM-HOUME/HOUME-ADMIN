import { useState } from 'react';

import type { AdminFloorPlanResponse } from '@apis/__generated__/data-contracts';

import * as ui from '@styles/adminUi.css';

import { getApiErrorMessage } from '@utils/getApiErrorMessage';

import { useFloorPlanListQuery } from './apis/queries/useFloorPlanListQuery';
import FloorPlanForm from './components/floorPlanForm/FloorPlanForm';
import FloorPlanList from './components/floorPlanList/FloorPlanList';

/** 도면 관리 — SSR 대시보드 '도면 관리' 탭 */
function FloorPlanPage() {
  const {
    data: floorPlans,
    isPending,
    error,
    refetch,
    isFetching,
  } = useFloorPlanListQuery();
  const [editingFloorPlan, setEditingFloorPlan] =
    useState<AdminFloorPlanResponse | null>(null);
  // 같은 모드(등록)에서 '폼 초기화'를 눌러도 폼이 새로 만들어지도록 key에 섞는다
  const [formVersion, setFormVersion] = useState(0);
  // 도면은 이미지가 많아 목록이 길다 → SSR처럼 목록을 접을 수 있게 한다
  const [isListVisible, setIsListVisible] = useState(true);

  const resetForm = () => {
    setEditingFloorPlan(null);
    setFormVersion((prev) => prev + 1);
  };

  const startEdit = (floorPlan: AdminFloorPlanResponse) => {
    setEditingFloorPlan(floorPlan);
    setFormVersion((prev) => prev + 1);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const renderList = () => {
    if (isPending) return <p className={ui.emptyText}>불러오는 중...</p>;
    if (error) {
      return (
        <p className={ui.errorText} role="alert">
          {getApiErrorMessage(error, '도면 목록을 불러오지 못했습니다.')}
        </p>
      );
    }
    return (
      <FloorPlanList
        floorPlans={floorPlans}
        editingFloorPlanId={editingFloorPlan?.id}
        onEdit={startEdit}
        onDeleted={(floorPlanId) => {
          if (editingFloorPlan?.id === floorPlanId) resetForm();
        }}
      />
    );
  };

  return (
    <>
      <h2 className={ui.pageTitle}>도면 관리</h2>

      <section className={ui.card}>
        <div className={ui.cardHeader}>
          도면 목록
          <div className={ui.buttonRow}>
            <button
              className={ui.button.secondary}
              type="button"
              onClick={() => setIsListVisible((prev) => !prev)}
            >
              {isListVisible ? '도면 목록 숨기기' : '도면 목록 보기'}
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
              도면 목록 새로고침
            </button>
          </div>
        </div>
        {isListVisible && <div className={ui.cardBody}>{renderList()}</div>}
      </section>

      <section className={ui.card}>
        <div className={ui.cardHeader}>
          {editingFloorPlan
            ? `도면 수정 (#${editingFloorPlan.id})`
            : '도면 등록'}
        </div>
        <div className={ui.cardBody}>
          <FloorPlanForm
            key={`${editingFloorPlan?.id ?? 'new'}-${formVersion}`}
            editingFloorPlan={editingFloorPlan}
            onReset={resetForm}
          />
        </div>
      </section>
    </>
  );
}

export default FloorPlanPage;
