import { toast } from 'sonner';

import type {
  FurnitureInfo,
  TagInfo,
} from '@apis/__generated__/data-contracts';

import * as ui from '@styles/adminUi.css';

import * as styles from './FurnitureTable.css';
import { useDeleteFurnitureMutation } from '../../apis/mutations/useDeleteFurnitureMutation';
import { useDeleteFurnitureTagMutation } from '../../apis/mutations/useDeleteFurnitureTagMutation';

import type { FurnitureTagSelection } from '../../utils/furnitureForm';

interface FurnitureTableProps {
  furnitures: FurnitureInfo[];
  selection: FurnitureTagSelection | null;
  onEdit: (selection: FurnitureTagSelection) => void;
  /** 수정 중인 연결(또는 그 가구)을 지웠을 때 수정 폼을 비우기 위해 부모에 알린다 */
  onDeleted: (target: { furnitureNameKr: string; tagId?: number }) => void;
}

/** 등록된 가구 — 가구마다 연결된 태그(이미지 · 키워드 · 우선순위)와 작업 버튼 */
function FurnitureTable({
  furnitures,
  selection,
  onEdit,
  onDeleted,
}: FurnitureTableProps) {
  const { mutate: deleteFurniture, isPending: isDeletingFurniture } =
    useDeleteFurnitureMutation();
  const { mutate: deleteFurnitureTag, isPending: isDeletingTag } =
    useDeleteFurnitureTagMutation();

  const handleDeleteFurniture = (furnitureNameKr: string) => {
    if (
      !window.confirm(`'${furnitureNameKr}' 가구를 정말로 삭제하시겠습니까?`)
    ) {
      return;
    }
    deleteFurniture(furnitureNameKr, {
      onSuccess: () => {
        toast.success('가구가 삭제되었습니다.');
        onDeleted({ furnitureNameKr });
      },
    });
  };

  const handleDeleteTag = (furnitureNameKr: string, tagId: number) => {
    if (
      !window.confirm(
        `'${furnitureNameKr}' 가구에서 태그 ID ${tagId}를 삭제하시겠습니까?`
      )
    ) {
      return;
    }
    deleteFurnitureTag(
      { furnitureNameKr, tagId },
      {
        onSuccess: () => {
          toast.success('가구 태그가 삭제되었습니다.');
          onDeleted({ furnitureNameKr, tagId });
        },
      }
    );
  };

  const renderTag = (furnitureNameKr: string, tag: TagInfo) => {
    const tagId = tag.tagId;
    const isSelected =
      selection?.furnitureNameKr === furnitureNameKr &&
      selection.tagId === tagId;

    return (
      <li
        key={tag.furnitureTagId ?? tagId}
        className={`${styles.tagRow} ${isSelected ? styles.tagRowSelected : ''}`}
      >
        {tag.imageUrl ? (
          <img
            className={styles.tagImage}
            src={tag.imageUrl}
            alt={tag.tagName ?? ''}
          />
        ) : null}
        <div className={styles.tagMeta}>
          <span className={styles.tagName}>
            {tag.tagName ?? '-'} (Tag ID: {tagId ?? '-'})
          </span>
          <span className={styles.tagSub}>
            키워드: {tag.searchKeyword ?? ''} · 우선순위: {tag.priority ?? ''}
          </span>
        </div>
        <div className={ui.buttonRow}>
          <button
            className={ui.button.secondary}
            type="button"
            disabled={tagId === undefined}
            onClick={() => {
              if (tagId === undefined) return;
              onEdit({
                furnitureNameKr,
                tagId,
                searchKeyword: tag.searchKeyword ?? '',
                priority:
                  tag.priority !== undefined ? String(tag.priority) : '',
              });
            }}
          >
            수정
          </button>
          <button
            className={ui.button.danger}
            type="button"
            disabled={tagId === undefined || isDeletingTag}
            onClick={() => {
              if (tagId !== undefined) handleDeleteTag(furnitureNameKr, tagId);
            }}
          >
            삭제
          </button>
        </div>
      </li>
    );
  };

  if (furnitures.length === 0) {
    return <p className={ui.emptyText}>등록된 가구가 없습니다.</p>;
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.th}>ID</th>
          <th className={styles.th}>가구 이름</th>
          <th className={styles.th}>태그 / 이미지 / 정보</th>
          <th className={styles.th}>작업</th>
        </tr>
      </thead>
      <tbody>
        {furnitures.map((furniture) => {
          const nameKr = furniture.furnitureNameKr ?? '';
          const tags = furniture.tags ?? [];
          return (
            <tr key={furniture.furnitureId}>
              <td className={styles.td}>{furniture.furnitureId}</td>
              <td className={styles.td}>{nameKr}</td>
              <td className={styles.td}>
                {tags.length > 0 ? (
                  <ul className={styles.tagList}>
                    {tags.map((tag) => renderTag(nameKr, tag))}
                  </ul>
                ) : (
                  <span className={ui.helperText}>연결된 태그가 없습니다.</span>
                )}
              </td>
              <td className={styles.td}>
                <button
                  className={ui.button.danger}
                  type="button"
                  disabled={!nameKr || isDeletingFurniture}
                  onClick={() => handleDeleteFurniture(nameKr)}
                >
                  가구 삭제
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default FurnitureTable;
