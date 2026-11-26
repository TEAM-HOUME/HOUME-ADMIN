import { useState } from 'react';

import { toast } from 'sonner';

import type {
  AdminCurationRawProductFurnitureTagResponse,
  AdminCurationRawProductResponse,
} from '@apis/__generated__/data-contracts';

import * as ui from '@styles/adminUi.css';

import * as styles from './RawProductMappingPanel.css';
import { useCreateRawProductMappingMutation } from '../../apis/mutations/useCreateRawProductMappingMutation';
import { useDeleteRawProductMappingMutation } from '../../apis/mutations/useDeleteRawProductMappingMutation';
import { useUpdateRawProductMappingMutation } from '../../apis/mutations/useUpdateRawProductMappingMutation';
import {
  formatFurnitureTagLabel,
  getFurnitureTagDisplayName,
  type SelectedFurnitureTag,
} from '../../utils/rawProductForm';
import FurnitureTagSelect from '../furnitureTagSelect/FurnitureTagSelect';

interface RawProductMappingPanelProps {
  product: AdminCurationRawProductResponse & { id: number };
}

/**
 * 가구 태그 매핑 하나씩 추가 · 수정 · 삭제 (정보 수정의 '통째로 교체'와 별개).
 * 수정은 현재 매핑을 '수정 대상으로 선택'한 뒤 새 Furniture Tag를 고른다.
 */
function RawProductMappingPanel({ product }: RawProductMappingPanelProps) {
  const [target, setTarget] =
    useState<AdminCurationRawProductFurnitureTagResponse | null>(null);
  const [chosenTag, setChosenTag] = useState<SelectedFurnitureTag | null>(null);
  // 수정 대상을 바꿀 때 태그 선택기를 그 타입으로 새로 연다
  const [selectorVersion, setSelectorVersion] = useState(0);
  const { mutate: createMapping, isPending: isCreating } =
    useCreateRawProductMappingMutation();
  const { mutate: updateMapping, isPending: isUpdating } =
    useUpdateRawProductMappingMutation();
  const { mutate: deleteMapping, isPending: isDeleting } =
    useDeleteRawProductMappingMutation();

  const mappings = product.furnitureTags ?? [];
  const isBusy = isCreating || isUpdating || isDeleting;

  const resetSelection = () => {
    setTarget(null);
    setChosenTag(null);
    setSelectorVersion((prev) => prev + 1);
  };

  const selectTarget = (
    mapping: AdminCurationRawProductFurnitureTagResponse
  ) => {
    setTarget(mapping);
    setChosenTag(null);
    setSelectorVersion((prev) => prev + 1);
  };

  const handleCreate = () => {
    if (!chosenTag) {
      toast.error('추가할 Furniture Tag를 선택해주세요.');
      return;
    }
    createMapping(
      { rawProductId: product.id, furnitureTagId: chosenTag.furnitureTagId },
      {
        onSuccess: () => {
          toast.success('가구 태그 매핑이 추가되었습니다.');
          resetSelection();
        },
      }
    );
  };

  const handleUpdate = () => {
    if (target?.mappingId === undefined) {
      toast.error('수정할 매핑을 목록에서 먼저 선택해주세요.');
      return;
    }
    if (!chosenTag) {
      toast.error('바꿀 Furniture Tag를 선택해주세요.');
      return;
    }
    updateMapping(
      {
        rawProductId: product.id,
        mappingId: target.mappingId,
        furnitureTagId: chosenTag.furnitureTagId,
      },
      {
        onSuccess: () => {
          toast.success('가구 태그 매핑이 수정되었습니다.');
          resetSelection();
        },
      }
    );
  };

  const handleDelete = (mappingId: number) => {
    if (!window.confirm(`매핑 ID ${mappingId}를 정말로 삭제하시겠습니까?`))
      return;
    deleteMapping(
      { rawProductId: product.id, mappingId },
      {
        onSuccess: () => {
          toast.success('가구 태그 매핑이 삭제되었습니다.');
          if (target?.mappingId === mappingId) resetSelection();
        },
      }
    );
  };

  return (
    <div className={ui.formStack}>
      {mappings.length === 0 ? (
        <p className={ui.emptyText}>현재 연결된 가구 태그가 없습니다.</p>
      ) : (
        <ul className={styles.list}>
          {mappings.map((mapping) => {
            const mappingId = mapping.mappingId;
            const isTarget =
              mappingId !== undefined && mappingId === target?.mappingId;
            return (
              <li
                key={mappingId ?? mapping.furnitureTagId}
                className={`${styles.item} ${isTarget ? styles.itemSelected : ''}`}
              >
                <span className={styles.itemTitle}>
                  {mapping.furnitureTypeNameKr || '-'} /{' '}
                  {mapping.furnitureNameKr || '-'} /{' '}
                  {getFurnitureTagDisplayName(mapping)}
                </span>
                <span className={styles.itemMeta}>
                  mapping #{mappingId} · furnitureTag #{mapping.furnitureTagId}{' '}
                  · priority {mapping.priority ?? '-'} · 키워드{' '}
                  {mapping.searchKeyword || '-'}
                </span>
                <div className={ui.buttonRow}>
                  <button
                    className={ui.button.secondary}
                    type="button"
                    disabled={mappingId === undefined || isTarget}
                    onClick={() => selectTarget(mapping)}
                  >
                    {isTarget ? '수정 대상' : '수정 대상으로 선택'}
                  </button>
                  <button
                    className={ui.button.danger}
                    type="button"
                    disabled={mappingId === undefined || isBusy}
                    onClick={() => {
                      if (mappingId !== undefined) handleDelete(mappingId);
                    }}
                  >
                    삭제
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <p className={ui.helperText}>
        {target
          ? `수정 대상: mapping #${target.mappingId} / furnitureTag #${target.furnitureTagId}`
          : '새 매핑을 추가하거나, 목록에서 수정 대상을 고르세요.'}
      </p>
      <FurnitureTagSelect
        key={selectorVersion}
        initialFurnitureTypeId={target?.furnitureTypeId ?? null}
        disabledIds={mappings.flatMap((mapping) =>
          mapping.furnitureTagId === undefined ? [] : [mapping.furnitureTagId]
        )}
        onSelect={setChosenTag}
      />
      <p className={chosenTag ? ui.readonlyBox : ui.helperText}>
        {chosenTag
          ? `선택한 태그: ${formatFurnitureTagLabel(chosenTag)}`
          : '선택된 태그 없음'}
      </p>

      <div className={ui.buttonRow}>
        <button
          className={ui.button.primary}
          type="button"
          onClick={handleCreate}
          disabled={!chosenTag || isBusy}
        >
          매핑 추가
        </button>
        <button
          className={ui.button.secondary}
          type="button"
          onClick={handleUpdate}
          disabled={!target || !chosenTag || isBusy}
        >
          선택한 매핑 수정
        </button>
        {target && (
          <button
            className={ui.button.secondary}
            type="button"
            onClick={resetSelection}
          >
            선택 해제
          </button>
        )}
      </div>
    </div>
  );
}

export default RawProductMappingPanel;
