import { useState } from 'react';

import type { AdminStyleResponse } from '@apis/__generated__/data-contracts';

import * as ui from '@styles/adminUi.css';

import { getApiErrorMessage } from '@utils/getApiErrorMessage';

import { useStyleListQuery } from './apis/queries/useStyleListQuery';
import StyleForm from './components/styleForm/StyleForm';
import StyleList from './components/styleList/StyleList';

/** 스타일로 시작하기 관리 — SSR 대시보드 '스타일로 시작하기 관리' 탭 */
function StylePage() {
  const {
    data: styleList,
    isPending,
    error,
    refetch,
    isFetching,
  } = useStyleListQuery();
  const [editingStyle, setEditingStyle] = useState<AdminStyleResponse | null>(
    null
  );
  // 같은 모드(등록)에서 '폼 초기화'를 눌러도 폼이 새로 만들어지도록 key에 섞는다
  const [formVersion, setFormVersion] = useState(0);

  const resetForm = () => {
    setEditingStyle(null);
    setFormVersion((prev) => prev + 1);
  };

  const startEdit = (item: AdminStyleResponse) => {
    setEditingStyle(item);
    setFormVersion((prev) => prev + 1);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const renderList = () => {
    if (isPending) return <p className={ui.emptyText}>불러오는 중...</p>;
    if (error) {
      return (
        <p className={ui.errorText} role="alert">
          {getApiErrorMessage(error, '스타일 목록을 불러오지 못했습니다.')}
        </p>
      );
    }
    return (
      <StyleList
        styleList={styleList}
        editingStyleId={editingStyle?.id}
        onEdit={startEdit}
        onDeleted={(styleId) => {
          if (editingStyle?.id === styleId) resetForm();
        }}
      />
    );
  };

  return (
    <>
      <h2 className={ui.pageTitle}>스타일로 시작하기 관리</h2>

      <section className={ui.card}>
        <div className={ui.cardHeader}>
          스타일 목록
          <button
            className={ui.button.secondary}
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
          >
            스타일 목록 새로고침
          </button>
        </div>
        <div className={ui.cardBody}>{renderList()}</div>
      </section>

      <section className={ui.card}>
        <div className={ui.cardHeader}>
          {editingStyle ? `스타일 수정 (#${editingStyle.id})` : '스타일 등록'}
        </div>
        <div className={ui.cardBody}>
          <StyleForm
            key={`${editingStyle?.id ?? 'new'}-${formVersion}`}
            editingStyle={editingStyle}
            onReset={resetForm}
          />
        </div>
      </section>
    </>
  );
}

export default StylePage;
