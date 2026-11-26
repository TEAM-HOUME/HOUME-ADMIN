import { toast } from 'sonner';

import type { PresetItemResponse } from '@apis/__generated__/data-contracts';

import * as table from '@styles/adminTable.css';
import * as ui from '@styles/adminUi.css';

import * as styles from './PresetList.css';
import { useDeletePresetMutation } from '../../apis/mutations/useDeletePresetMutation';

interface PresetListProps {
  presets: PresetItemResponse[];
  onEdit: (presetId: number) => void;
  /** 수정 폼을 채우는 중인 프리셋 */
  loadingPresetId: number | null;
}

function PresetList({ presets, onEdit, loadingPresetId }: PresetListProps) {
  const { mutate: deletePreset, isPending: isDeleting } =
    useDeletePresetMutation();

  const handleDelete = (presetId: number) => {
    if (!window.confirm(`프리셋 ${presetId}를 삭제하시겠습니까?`)) return;
    deletePreset(presetId, {
      onSuccess: () => toast.success('프리셋이 삭제되었습니다.'),
    });
  };

  if (presets.length === 0) {
    return <p className={ui.emptyText}>등록된 프리셋이 없습니다.</p>;
  }

  return (
    <div className={table.wrapper}>
      <table className={table.table}>
        <thead>
          <tr>
            <th className={table.th}>ID</th>
            <th className={table.th}>썸네일</th>
            <th className={table.th}>상품명</th>
            <th className={table.th}>액션</th>
          </tr>
        </thead>
        <tbody>
          {presets.map((preset) => {
            const { presetId } = preset;
            return (
              <tr key={presetId}>
                <td className={table.td}>{presetId}</td>
                <td className={table.td}>
                  {preset.thumbnailUrl ? (
                    <img
                      className={styles.thumbnail}
                      src={preset.thumbnailUrl}
                      alt=""
                    />
                  ) : (
                    '-'
                  )}
                </td>
                <td className={table.td}>{preset.title}</td>
                <td className={table.td}>
                  <div className={ui.buttonRow}>
                    <button
                      className={ui.button.secondary}
                      type="button"
                      disabled={
                        presetId === undefined || loadingPresetId !== null
                      }
                      onClick={() => {
                        if (presetId !== undefined) onEdit(presetId);
                      }}
                    >
                      {loadingPresetId === presetId ? '불러오는 중...' : '수정'}
                    </button>
                    <button
                      className={ui.button.danger}
                      type="button"
                      disabled={presetId === undefined || isDeleting}
                      onClick={() => {
                        if (presetId !== undefined) handleDelete(presetId);
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
    </div>
  );
}

export default PresetList;
