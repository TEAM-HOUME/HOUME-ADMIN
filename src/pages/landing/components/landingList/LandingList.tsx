import { toast } from 'sonner';

import type { AdminLandingResponse } from '@apis/__generated__/data-contracts';

import * as ui from '@styles/adminUi.css';

import * as styles from './LandingList.css';
import { useDeleteLandingMutation } from '../../apis/mutations/useDeleteLandingMutation';

interface LandingListProps {
  landings: AdminLandingResponse[];
  editingLandingId?: number;
  onEdit: (landing: AdminLandingResponse) => void;
  /** 수정 중인 랜딩을 지웠을 때 폼을 비우기 위해 부모에 알린다 */
  onDeleted: (landingId: number) => void;
}

function LandingList({
  landings,
  editingLandingId,
  onEdit,
  onDeleted,
}: LandingListProps) {
  const { mutate: deleteLanding, isPending: isDeleting } =
    useDeleteLandingMutation();

  const handleDelete = (landingId: number) => {
    if (!window.confirm(`랜딩 ID ${landingId}를 정말로 삭제하시겠습니까?`)) {
      return;
    }
    deleteLanding(landingId, {
      onSuccess: () => {
        toast.success('랜딩이 삭제되었습니다.');
        onDeleted(landingId);
      },
    });
  };

  if (landings.length === 0) {
    return <p className={ui.emptyText}>등록된 랜딩이 없습니다.</p>;
  }

  return (
    <ul className={styles.list}>
      {landings.map((landing) => {
        const isEditing =
          landing.id !== undefined && landing.id === editingLandingId;

        return (
          <li
            key={landing.id}
            className={`${styles.card} ${isEditing ? styles.cardEditing : ''}`}
          >
            {landing.bannerImageUrl ? (
              <img
                className={styles.image}
                src={landing.bannerImageUrl}
                alt={`${landing.bannerTitle ?? ''} 랜딩`}
              />
            ) : (
              <div className={styles.image} />
            )}
            <div className={styles.titleRow}>
              <span className={styles.title}>{landing.bannerTitle}</span>
              <span className={styles.id}>#{landing.id}</span>
            </div>
            <div className={ui.buttonRow}>
              <button
                className={ui.button.secondary}
                type="button"
                onClick={() => onEdit(landing)}
              >
                수정
              </button>
              <button
                className={ui.button.danger}
                type="button"
                disabled={landing.id === undefined || isDeleting}
                onClick={() => {
                  if (landing.id !== undefined) handleDelete(landing.id);
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

export default LandingList;
