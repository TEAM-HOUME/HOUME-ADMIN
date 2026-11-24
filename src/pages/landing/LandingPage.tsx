import { useState } from 'react';

import type { AdminLandingResponse } from '@apis/__generated__/data-contracts';

import * as ui from '@styles/adminUi.css';

import { getApiErrorMessage } from '@utils/getApiErrorMessage';

import { useLandingListQuery } from './apis/queries/useLandingListQuery';
import LandingForm from './components/landingForm/LandingForm';
import LandingList from './components/landingList/LandingList';

/** 랜딩 관리 — SSR 대시보드 '랜딩 관리' 탭 */
function LandingPage() {
  const {
    data: landings,
    isPending,
    error,
    refetch,
    isFetching,
  } = useLandingListQuery();
  const [editingLanding, setEditingLanding] =
    useState<AdminLandingResponse | null>(null);
  // 같은 모드(등록)에서 '폼 초기화'를 눌러도 폼이 새로 만들어지도록 key에 섞는다
  const [formVersion, setFormVersion] = useState(0);

  const resetForm = () => {
    setEditingLanding(null);
    setFormVersion((prev) => prev + 1);
  };

  const startEdit = (landing: AdminLandingResponse) => {
    setEditingLanding(landing);
    setFormVersion((prev) => prev + 1);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const renderList = () => {
    if (isPending) return <p className={ui.emptyText}>불러오는 중...</p>;
    if (error) {
      return (
        <p className={ui.errorText} role="alert">
          {getApiErrorMessage(error, '랜딩 목록을 불러오지 못했습니다.')}
        </p>
      );
    }
    return (
      <LandingList
        landings={landings}
        editingLandingId={editingLanding?.id}
        onEdit={startEdit}
        onDeleted={(landingId) => {
          if (editingLanding?.id === landingId) resetForm();
        }}
      />
    );
  };

  return (
    <>
      <h2 className={ui.pageTitle}>랜딩 관리</h2>

      <section className={ui.card}>
        <div className={ui.cardHeader}>
          랜딩 목록
          <button
            className={ui.button.secondary}
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
          >
            랜딩 목록 새로고침
          </button>
        </div>
        <div className={ui.cardBody}>{renderList()}</div>
      </section>

      <section className={ui.card}>
        <div className={ui.cardHeader}>
          {editingLanding ? `랜딩 수정 (#${editingLanding.id})` : '랜딩 등록'}
        </div>
        <div className={ui.cardBody}>
          <LandingForm
            key={`${editingLanding?.id ?? 'new'}-${formVersion}`}
            editingLanding={editingLanding}
            onReset={resetForm}
          />
        </div>
      </section>
    </>
  );
}

export default LandingPage;
