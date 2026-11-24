import { toast } from 'sonner';

import type { AdminStyleResponse } from '@apis/__generated__/data-contracts';

import * as ui from '@styles/adminUi.css';

import * as styles from './StyleList.css';
import { useDeleteStyleMutation } from '../../apis/mutations/useDeleteStyleMutation';

interface StyleListProps {
  styleList: AdminStyleResponse[];
  editingStyleId?: number;
  onEdit: (style: AdminStyleResponse) => void;
  /** 수정 중인 스타일을 지웠을 때 폼을 비우기 위해 부모에 알린다 */
  onDeleted: (styleId: number) => void;
}

function StyleList({
  styleList,
  editingStyleId,
  onEdit,
  onDeleted,
}: StyleListProps) {
  const { mutate: deleteStyle, isPending: isDeleting } =
    useDeleteStyleMutation();

  const handleDelete = (styleId: number) => {
    if (!window.confirm(`스타일 ID ${styleId}를 정말로 삭제하시겠습니까?`)) {
      return;
    }
    deleteStyle(styleId, {
      onSuccess: () => {
        toast.success('스타일이 삭제되었습니다.');
        onDeleted(styleId);
      },
    });
  };

  if (styleList.length === 0) {
    return <p className={ui.emptyText}>등록된 스타일이 없습니다.</p>;
  }

  return (
    <ul className={styles.list}>
      {styleList.map((item) => {
        const mappedRawProducts = item.mappedRawProducts ?? [];
        const isEditing = item.id !== undefined && item.id === editingStyleId;

        return (
          <li
            key={item.id}
            className={`${styles.card} ${isEditing ? styles.cardEditing : ''}`}
          >
            {item.bannerImageUrl ? (
              <img
                className={styles.image}
                src={item.bannerImageUrl}
                alt={item.bannerTitle ?? '스타일 이미지'}
              />
            ) : (
              <div className={styles.image} />
            )}

            <div>
              <div className={styles.titleRow}>
                <span className={styles.title}>{item.bannerTitle}</span>
                <span className={styles.id}>#{item.id}</span>
              </div>
              <dl className={styles.meta}>
                <dt className={styles.metaLabel}>스타일 설명</dt>
                <dd>{item.styleDescription}</dd>
                <dt className={styles.metaLabel}>스타일 참고 프롬프트</dt>
                <dd>{item.stylePrompt}</dd>
                <dt className={styles.metaLabel}>스타일에 매핑된 가구</dt>
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
                onClick={() => onEdit(item)}
              >
                수정
              </button>
              <button
                className={ui.button.danger}
                type="button"
                disabled={item.id === undefined || isDeleting}
                onClick={() => {
                  if (item.id !== undefined) handleDelete(item.id);
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

export default StyleList;
