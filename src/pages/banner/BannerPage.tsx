import { useState } from 'react';

import type { AdminBannerResponse } from '@apis/__generated__/data-contracts';

import * as ui from '@styles/adminUi.css';

import { getApiErrorMessage } from '@utils/getApiErrorMessage';

import { useBannerListQuery } from './apis/queries/useBannerListQuery';
import BannerForm from './components/bannerForm/BannerForm';
import BannerList from './components/bannerList/BannerList';

/** 배너 관리 — SSR 대시보드 '배너 관리' 탭 */
function BannerPage() {
  const {
    data: banners,
    isPending,
    error,
    refetch,
    isFetching,
  } = useBannerListQuery();
  const [editingBanner, setEditingBanner] =
    useState<AdminBannerResponse | null>(null);
  // 같은 모드(등록)에서 '폼 초기화'를 눌러도 폼이 새로 만들어지도록 key에 섞는다
  const [formVersion, setFormVersion] = useState(0);

  const resetForm = () => {
    setEditingBanner(null);
    setFormVersion((prev) => prev + 1);
  };

  const startEdit = (banner: AdminBannerResponse) => {
    setEditingBanner(banner);
    setFormVersion((prev) => prev + 1);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const renderList = () => {
    if (isPending) return <p className={ui.emptyText}>불러오는 중...</p>;
    if (error) {
      return (
        <p className={ui.errorText} role="alert">
          {getApiErrorMessage(error, '배너 목록을 불러오지 못했습니다.')}
        </p>
      );
    }
    return (
      <BannerList
        banners={banners}
        editingBannerId={editingBanner?.id}
        onEdit={startEdit}
        onDeleted={(bannerId) => {
          if (editingBanner?.id === bannerId) resetForm();
        }}
      />
    );
  };

  return (
    <>
      <h2 className={ui.pageTitle}>배너 관리</h2>

      <section className={ui.card}>
        <div className={ui.cardHeader}>
          배너 목록
          <button
            className={ui.button.secondary}
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
          >
            배너 목록 새로고침
          </button>
        </div>
        <div className={ui.cardBody}>{renderList()}</div>
      </section>

      <section className={ui.card}>
        <div className={ui.cardHeader}>
          {editingBanner ? `배너 수정 (#${editingBanner.id})` : '배너 등록'}
        </div>
        <div className={ui.cardBody}>
          <BannerForm
            key={`${editingBanner?.id ?? 'new'}-${formVersion}`}
            editingBanner={editingBanner}
            onReset={resetForm}
          />
        </div>
      </section>
    </>
  );
}

export default BannerPage;
