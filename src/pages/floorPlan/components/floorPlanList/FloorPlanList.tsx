import { toast } from 'sonner';

import type { AdminFloorPlanResponse } from '@apis/__generated__/data-contracts';

import * as ui from '@styles/adminUi.css';

import * as styles from './FloorPlanList.css';
import { useDeleteFloorPlanMutation } from '../../apis/mutations/useDeleteFloorPlanMutation';
import {
  EQUILIBRIUM_OPTIONS,
  formatOptionLabels,
  FORM_OPTIONS,
  STRUCTURE_OPTIONS,
} from '../../utils/floorPlanForm';

interface FloorPlanListProps {
  floorPlans: AdminFloorPlanResponse[];
  editingFloorPlanId?: number;
  onEdit: (floorPlan: AdminFloorPlanResponse) => void;
  /** 수정 중인 도면을 지웠을 때 폼을 비우기 위해 부모에 알린다 */
  onDeleted: (floorPlanId: number) => void;
}

/** 이미지가 없으면 대표 이미지 한 장이라도 보여준다 (SSR buildFloorPlanGallery) */
const getGalleryImages = (floorPlan: AdminFloorPlanResponse) => {
  const images = [...(floorPlan.images ?? [])].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
  );
  if (images.length > 0) return images;
  return floorPlan.representativeImageUrl
    ? [{ url: floorPlan.representativeImageUrl, view: undefined }]
    : [];
};

function FloorPlanList({
  floorPlans,
  editingFloorPlanId,
  onEdit,
  onDeleted,
}: FloorPlanListProps) {
  const { mutate: deleteFloorPlan, isPending: isDeleting } =
    useDeleteFloorPlanMutation();

  const handleDelete = (floorPlanId: number) => {
    if (!window.confirm(`도면 ID ${floorPlanId}를 정말로 삭제하시겠습니까?`)) {
      return;
    }
    deleteFloorPlan(floorPlanId, {
      onSuccess: () => {
        toast.success('도면이 삭제되었습니다.');
        onDeleted(floorPlanId);
      },
    });
  };

  if (floorPlans.length === 0) {
    return <p className={ui.emptyText}>등록된 도면이 없습니다.</p>;
  }

  return (
    <ul className={styles.list}>
      {floorPlans.map((floorPlan) => {
        const galleryImages = getGalleryImages(floorPlan);
        const isEditing =
          floorPlan.id !== undefined && floorPlan.id === editingFloorPlanId;

        return (
          <li
            key={floorPlan.id}
            className={`${styles.card} ${isEditing ? styles.cardEditing : ''}`}
          >
            <div>
              {galleryImages.length > 0 ? (
                <div className={styles.gallery}>
                  {galleryImages.map((image, index) => (
                    <figure
                      key={`${image.url}-${index}`}
                      className={styles.galleryItem}
                    >
                      <img
                        className={styles.galleryImage}
                        src={image.url}
                        alt={`도면 view ${index + 1}`}
                      />
                      <figcaption className={styles.galleryView}>
                        {image.view || `view ${index + 1}`}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ) : (
                <p className={ui.emptyText}>등록된 도면 이미지가 없습니다.</p>
              )}

              <div className={styles.titleRow}>
                <span className={styles.title}>
                  {floorPlan.name || `도면 #${floorPlan.id}`}
                </span>
                <span className={styles.subText}>
                  #{floorPlan.id} · 이미지 {floorPlan.images?.length ?? 0}장
                </span>
              </div>
              <dl className={styles.meta}>
                <dt className={styles.metaLabel}>주거형태</dt>
                <dd>{formatOptionLabels(floorPlan.forms, FORM_OPTIONS)}</dd>
                <dt className={styles.metaLabel}>구조</dt>
                <dd>
                  {formatOptionLabels(floorPlan.structures, STRUCTURE_OPTIONS)}
                </dd>
                <dt className={styles.metaLabel}>평형</dt>
                <dd>
                  {formatOptionLabels(
                    floorPlan.equilibriums,
                    EQUILIBRIUM_OPTIONS
                  )}
                </dd>
                <dt className={styles.metaLabel}>도면 프롬프트</dt>
                <dd>{floorPlan.floorPlanPrompt || '-'}</dd>
              </dl>
            </div>

            <div className={styles.actions}>
              <button
                className={ui.button.secondary}
                type="button"
                onClick={() => onEdit(floorPlan)}
              >
                수정
              </button>
              <button
                className={ui.button.danger}
                type="button"
                disabled={floorPlan.id === undefined || isDeleting}
                onClick={() => {
                  if (floorPlan.id !== undefined) handleDelete(floorPlan.id);
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

export default FloorPlanList;
