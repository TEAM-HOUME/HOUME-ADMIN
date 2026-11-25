import * as ui from '@styles/adminUi.css';

import { getApiErrorMessage } from '@utils/getApiErrorMessage';

import { useMoodboardListQuery } from './apis/queries/useMoodboardListQuery';
import MoodboardTable from './components/moodboardTable/MoodboardTable';
import MoodboardUploadForm from './components/moodboardUploadForm/MoodboardUploadForm';

/** 무드보드 관리 — SSR 대시보드 '무드보드 관리' 탭 */
function MoodboardPage() {
  const {
    data: moodboards,
    isPending,
    error,
    refetch,
    isFetching,
  } = useMoodboardListQuery();

  const renderList = () => {
    if (isPending) return <p className={ui.emptyText}>불러오는 중...</p>;
    if (error) {
      return (
        <p className={ui.errorText} role="alert">
          {getApiErrorMessage(error, '무드보드 목록을 불러오지 못했습니다.')}
        </p>
      );
    }
    return <MoodboardTable moodboards={moodboards} />;
  };

  return (
    <>
      <h2 className={ui.pageTitle}>무드보드 관리</h2>

      <section className={ui.card}>
        <div className={ui.cardHeader}>무드보드 이미지 업로드</div>
        <div className={ui.cardBody}>
          <MoodboardUploadForm />
        </div>
      </section>

      <section className={ui.card}>
        <div className={ui.cardHeader}>
          전체 무드보드
          <button
            className={ui.button.secondary}
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
          >
            무드보드 목록 새로고침
          </button>
        </div>
        <div className={ui.cardBody}>{renderList()}</div>
      </section>
    </>
  );
}

export default MoodboardPage;
