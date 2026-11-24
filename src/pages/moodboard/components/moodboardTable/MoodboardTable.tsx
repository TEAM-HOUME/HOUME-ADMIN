import { toast } from 'sonner';

import type { AdminMoodBoardGetResponseDTO } from '@apis/__generated__/data-contracts';

import * as ui from '@styles/adminUi.css';

import * as styles from './MoodboardTable.css';
import { useDeleteMoodboardMutation } from '../../apis/mutations/useDeleteMoodboardMutation';

interface MoodboardTableProps {
  moodboards: AdminMoodBoardGetResponseDTO[];
}

function MoodboardTable({ moodboards }: MoodboardTableProps) {
  const { mutate: deleteMoodboard, isPending: isDeleting } =
    useDeleteMoodboardMutation();

  const handleDelete = (filename: string) => {
    if (!window.confirm(`'${filename}' 무드보드를 정말로 삭제하시겠습니까?`)) {
      return;
    }
    deleteMoodboard(filename, {
      onSuccess: () => toast.success('무드보드가 삭제되었습니다.'),
    });
  };

  if (moodboards.length === 0) {
    return <p className={ui.emptyText}>무드보드가 없습니다.</p>;
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.th}>이미지</th>
          <th className={styles.th}>파일 이름</th>
          <th className={styles.th}>원본 파일 이름</th>
          <th className={styles.th}>작업</th>
        </tr>
      </thead>
      <tbody>
        {moodboards.map((moodboard) => (
          <tr key={moodboard.filename}>
            <td className={styles.td}>
              {moodboard.url ? (
                <img
                  className={styles.image}
                  src={moodboard.url}
                  alt={moodboard.originalFilename ?? ''}
                />
              ) : (
                '-'
              )}
            </td>
            <td className={styles.td}>{moodboard.filename}</td>
            <td className={styles.td}>{moodboard.originalFilename}</td>
            <td className={styles.td}>
              <button
                className={ui.button.danger}
                type="button"
                disabled={!moodboard.filename || isDeleting}
                onClick={() => {
                  if (moodboard.filename) handleDelete(moodboard.filename);
                }}
              >
                삭제
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default MoodboardTable;
