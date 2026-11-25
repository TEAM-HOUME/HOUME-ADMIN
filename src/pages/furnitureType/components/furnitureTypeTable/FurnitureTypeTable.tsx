import { toast } from 'sonner';

import type { AdminFurnitureTypeResponse } from '@apis/__generated__/data-contracts';

import * as ui from '@styles/adminUi.css';

import * as styles from './FurnitureTypeTable.css';
import { useDeleteFurnitureTypeMutation } from '../../apis/mutations/useDeleteFurnitureTypeMutation';

interface FurnitureTypeTableProps {
  furnitureTypes: AdminFurnitureTypeResponse[];
  selectedTypeId?: number;
  onEdit: (furnitureType: AdminFurnitureTypeResponse) => void;
  /** 수정 중인 타입을 지웠을 때 수정 폼을 비우기 위해 부모에 알린다 */
  onDeleted: (furnitureTypeId: number) => void;
}

function FurnitureTypeTable({
  furnitureTypes,
  selectedTypeId,
  onEdit,
  onDeleted,
}: FurnitureTypeTableProps) {
  const { mutate: deleteFurnitureType, isPending: isDeleting } =
    useDeleteFurnitureTypeMutation();

  const handleDelete = (furnitureTypeId: number) => {
    if (
      !window.confirm(
        `가구 타입 ID ${furnitureTypeId}를 정말로 삭제하시겠습니까?\n이 타입을 쓰는 가구가 있으면 삭제되지 않습니다.`
      )
    ) {
      return;
    }
    deleteFurnitureType(furnitureTypeId, {
      onSuccess: () => {
        toast.success('가구 타입이 삭제되었습니다.');
        onDeleted(furnitureTypeId);
      },
    });
  };

  if (furnitureTypes.length === 0) {
    return <p className={ui.emptyText}>등록된 가구 타입이 없습니다.</p>;
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.th}>ID</th>
          <th className={styles.th}>한글 이름</th>
          <th className={styles.th}>영어 이름</th>
          <th className={styles.th}>작업</th>
        </tr>
      </thead>
      <tbody>
        {furnitureTypes.map((type) => {
          const typeId = type.furnitureTypeId;
          return (
            <tr
              key={typeId}
              className={
                typeId !== undefined && typeId === selectedTypeId
                  ? styles.selectedRow
                  : undefined
              }
            >
              <td className={styles.td}>{typeId}</td>
              <td className={styles.td}>{type.furnitureTypeNameKr}</td>
              <td className={styles.td}>{type.furnitureTypeNameEng}</td>
              <td className={styles.td}>
                <div className={ui.buttonRow}>
                  <button
                    className={ui.button.secondary}
                    type="button"
                    onClick={() => onEdit(type)}
                  >
                    수정
                  </button>
                  <button
                    className={ui.button.danger}
                    type="button"
                    disabled={typeId === undefined || isDeleting}
                    onClick={() => {
                      if (typeId !== undefined) handleDelete(typeId);
                    }}
                  >
                    삭제
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default FurnitureTypeTable;
