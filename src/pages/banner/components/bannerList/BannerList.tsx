import { toast } from 'sonner';

import type { AdminBannerResponse } from '@apis/__generated__/data-contracts';

import * as ui from '@styles/adminUi.css';

import * as styles from './BannerList.css';
import { useDeleteBannerMutation } from '../../apis/mutations/useDeleteBannerMutation';

interface BannerListProps {
  banners: AdminBannerResponse[];
  editingBannerId?: number;
  onEdit: (banner: AdminBannerResponse) => void;
  /** 수정 중인 배너를 지웠을 때 폼을 비우기 위해 부모에 알린다 */
  onDeleted: (bannerId: number) => void;
}

function BannerList({
  banners,
  editingBannerId,
  onEdit,
  onDeleted,
}: BannerListProps) {
  const { mutate: deleteBanner, isPending: isDeleting } =
    useDeleteBannerMutation();

  const handleDelete = (bannerId: number) => {
    if (!window.confirm(`배너 ID ${bannerId}를 정말로 삭제하시겠습니까?`)) {
      return;
    }
    deleteBanner(bannerId, {
      onSuccess: () => {
        toast.success('배너가 삭제되었습니다.');
        onDeleted(bannerId);
      },
    });
  };

  if (banners.length === 0) {
    return <p className={ui.emptyText}>등록된 배너가 없습니다.</p>;
  }

  return (
    <ul className={styles.list}>
      {banners.map((banner) => {
        const chips = banner.styleAnswerChips ?? [];
        const mappedRawProducts = banner.mappedRawProducts ?? [];
        const isEditing =
          banner.id !== undefined && banner.id === editingBannerId;

        return (
          <li
            key={banner.id}
            className={`${styles.card} ${isEditing ? styles.cardEditing : ''}`}
          >
            {banner.bannerImageUrl ? (
              <img
                className={styles.image}
                src={banner.bannerImageUrl}
                alt={`${banner.bannerTitle ?? ''} 배너`}
              />
            ) : (
              <div className={styles.image} />
            )}

            <div>
              <div className={styles.titleRow}>
                <span className={styles.title}>{banner.bannerTitle}</span>
                <span className={styles.id}>#{banner.id}</span>
              </div>
              <dl className={styles.meta}>
                <dt className={styles.metaLabel}>스타일 설명</dt>
                <dd>{banner.styleDescription}</dd>
                <dt className={styles.metaLabel}>스타일 질문</dt>
                <dd>{banner.styleQuestion}</dd>
                <dt className={styles.metaLabel}>이미지 생성 프롬프트</dt>
                <dd>{banner.stylePrompt}</dd>
                <dt className={styles.metaLabel}>스타일 답변 칩</dt>
                <dd>
                  {chips.length > 0 ? (
                    <div className={styles.tagList}>
                      {chips.map((chip) => (
                        <div
                          key={chip.id ?? chip.order}
                          className={styles.chipSummary}
                        >
                          <span className={ui.tag}>
                            {chip.label} · #{chip.curationRawProductId}
                          </span>
                          <span className={styles.chipPrompt}>
                            {chip.selectedPrompt ?? '-'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    '등록된 스타일 답변이 없습니다.'
                  )}
                </dd>
                <dt className={styles.metaLabel}>배너에 매핑된 가구</dt>
                <dd>
                  {mappedRawProducts.length > 0 ? (
                    <div className={styles.tagList}>
                      {mappedRawProducts.map((product) => (
                        <span key={product.id} className={ui.tag}>
                          {product.productName} · #{product.id}
                        </span>
                      ))}
                    </div>
                  ) : (
                    '매핑된 가구가 없습니다.'
                  )}
                </dd>
              </dl>
            </div>

            <div className={styles.actions}>
              <button
                className={ui.button.secondary}
                type="button"
                onClick={() => onEdit(banner)}
              >
                수정
              </button>
              <button
                className={ui.button.danger}
                type="button"
                disabled={banner.id === undefined || isDeleting}
                onClick={() => {
                  if (banner.id !== undefined) handleDelete(banner.id);
                }}
              >
                삭제
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default BannerList;
