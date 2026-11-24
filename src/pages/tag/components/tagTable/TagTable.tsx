import { toast } from 'sonner';

import type { AdminTagGetResponseDTO } from '@apis/__generated__/data-contracts';

import * as ui from '@styles/adminUi.css';

import * as styles from './TagTable.css';
import { useDeleteTagMutation } from '../../apis/mutations/useDeleteTagMutation';

interface TagTableProps {
  tags: AdminTagGetResponseDTO[];
  selectedTagId?: number;
  onEdit: (tag: AdminTagGetResponseDTO) => void;
  /** 수정 중인 태그를 지웠을 때 수정 폼을 비우기 위해 부모에 알린다 */
  onDeleted: (tagId: number) => void;
}

function TagTable({ tags, selectedTagId, onEdit, onDeleted }: TagTableProps) {
  const { mutate: deleteTag, isPending: isDeleting } = useDeleteTagMutation();

  const handleDelete = (tag: AdminTagGetResponseDTO) => {
    if (tag.id === undefined) return;
    const tagId = tag.id;
    if (
      !window.confirm(
        `'${tag.tag_name_kr ?? ''}' 태그(ID: ${tagId})를 정말로 삭제하시겠습니까?`
      )
    ) {
      return;
    }
    deleteTag(tagId, {
      onSuccess: () => {
        toast.success('태그가 삭제되었습니다.');
        onDeleted(tagId);
      },
    });
  };

  if (tags.length === 0) {
    return <p className={ui.emptyText}>등록된 태그가 없습니다.</p>;
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.th}>ID</th>
          <th className={styles.th}>우선순위</th>
          <th className={styles.th}>태그 이름 (영문)</th>
          <th className={styles.th}>태그 이름 (한글)</th>
          <th className={styles.th}>프롬프트</th>
          <th className={styles.th}>작업</th>
        </tr>
      </thead>
      <tbody>
        {tags.map((tag) => (
          <tr
            key={tag.id}
            className={
              tag.id !== undefined && tag.id === selectedTagId
                ? styles.selectedRow
                : undefined
            }
          >
            <td className={styles.td}>{tag.id}</td>
            <td className={styles.td}>{tag.priority}</td>
            <td className={styles.td}>{tag.tagName}</td>
            <td className={styles.td}>{tag.tag_name_kr}</td>
            <td className={styles.td}>
              {tag.tag_prompt ? (
                <details>
                  <summary className={styles.promptSummary}>보기</summary>
                  <p className={styles.prompt}>{tag.tag_prompt}</p>
                </details>
              ) : (
                '-'
              )}
            </td>
            <td className={styles.td}>
              <div className={ui.buttonRow}>
                <button
                  className={ui.button.secondary}
                  type="button"
                  onClick={() => onEdit(tag)}
                >
                  수정
                </button>
                <button
                  className={ui.button.danger}
                  type="button"
                  disabled={tag.id === undefined || isDeleting}
                  onClick={() => handleDelete(tag)}
                >
                  삭제
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TagTable;
