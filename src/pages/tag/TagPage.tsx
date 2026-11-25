import { useState } from 'react';

import type { AdminTagGetResponseDTO } from '@apis/__generated__/data-contracts';
import { useTagListQuery } from '@apis/queries/useTagListQuery';

import * as ui from '@styles/adminUi.css';

import { getApiErrorMessage } from '@utils/getApiErrorMessage';

import TagCreateForm from './components/tagCreateForm/TagCreateForm';
import TagTable from './components/tagTable/TagTable';
import TagUpdateForm from './components/tagUpdateForm/TagUpdateForm';

/** 태그 관리(스타일 태그) — SSR 대시보드 '태그 관리' 탭 */
function TagPage() {
  const {
    data: tags,
    isPending,
    error,
    refetch,
    isFetching,
  } = useTagListQuery();
  const [selectedTag, setSelectedTag] = useState<AdminTagGetResponseDTO | null>(
    null
  );
  // 같은 태그를 다시 고르거나 초기화해도 수정 폼이 새로 만들어지도록 key에 섞는다
  const [formVersion, setFormVersion] = useState(0);

  const selectTag = (tag: AdminTagGetResponseDTO | null) => {
    setSelectedTag(tag);
    setFormVersion((prev) => prev + 1);
  };

  const startEdit = (tag: AdminTagGetResponseDTO) => {
    selectTag(tag);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const renderList = () => {
    if (isPending) return <p className={ui.emptyText}>불러오는 중...</p>;
    if (error) {
      return (
        <p className={ui.errorText} role="alert">
          {getApiErrorMessage(error, '태그 목록을 불러오지 못했습니다.')}
        </p>
      );
    }
    return (
      <TagTable
        tags={tags}
        selectedTagId={selectedTag?.id}
        onEdit={startEdit}
        onDeleted={(tagId) => {
          if (selectedTag?.id === tagId) selectTag(null);
        }}
      />
    );
  };

  return (
    <>
      <h2 className={ui.pageTitle}>태그 관리</h2>

      <section className={ui.card}>
        <div className={ui.cardHeader}>
          등록된 태그
          <button
            className={ui.button.secondary}
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
          >
            태그 목록 새로고침
          </button>
        </div>
        <div className={ui.cardBody}>{renderList()}</div>
      </section>

      <section className={ui.card}>
        <div className={ui.cardHeader}>태그 생성</div>
        <div className={ui.cardBody}>
          <TagCreateForm />
        </div>
      </section>

      <section className={ui.card}>
        <div className={ui.cardHeader}>
          {selectedTag ? `태그 수정 (#${selectedTag.id})` : '태그 수정'}
        </div>
        <div className={ui.cardBody}>
          <TagUpdateForm
            key={`${selectedTag?.id ?? 'none'}-${formVersion}`}
            selectedTag={selectedTag}
            onReset={() => selectTag(null)}
          />
        </div>
      </section>
    </>
  );
}

export default TagPage;
