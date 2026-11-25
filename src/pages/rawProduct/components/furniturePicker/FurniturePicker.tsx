import { useState } from 'react';

import { useFurnitureTypeListQuery } from '@apis/queries/useFurnitureTypeListQuery';

import * as ui from '@styles/adminUi.css';

import { useFurnituresByTypeQuery } from '../../apis/queries/useFurnituresByTypeQuery';
import * as shared from '../../rawProduct.css';
import FurnitureTypeSelect from '../furnitureTypeSelect/FurnitureTypeSelect';

import type { SelectedFurniture } from '../../utils/rawProductForm';

interface FurniturePickerProps {
  value: SelectedFurniture[];
  onChange: (next: SelectedFurniture[]) => void;
}

/**
 * 하위가구 매핑 — 상위가구 타입을 고르고, 하위가구를 고르면 바로 추가된다.
 * (SSR은 고른 뒤 '추가'를 눌러야 했고, 누르지 않으면 제출 때 자동으로 추가했다)
 */
function FurniturePicker({ value, onChange }: FurniturePickerProps) {
  const [furnitureTypeId, setFurnitureTypeId] = useState<number | null>(null);
  const { data: furnitureTypes } = useFurnitureTypeListQuery();
  const { data: furnitures, isFetching } =
    useFurnituresByTypeQuery(furnitureTypeId);

  const typeName = furnitureTypes?.find(
    (type) => type.furnitureTypeId === furnitureTypeId
  )?.furnitureTypeNameKr;

  const add = (furnitureIdValue: string) => {
    const furnitureId = Number(furnitureIdValue);
    const furniture = furnitures?.find(
      (item) => item.furnitureId === furnitureId
    );
    if (!furniture || value.some((item) => item.furnitureId === furnitureId)) {
      return;
    }
    onChange([
      ...value,
      {
        furnitureId,
        furnitureNameKr: furniture.furnitureNameKr ?? '-',
        furnitureTypeNameKr: typeName,
      },
    ]);
  };

  const furniturePlaceholder = (() => {
    if (furnitureTypeId === null) return '상위가구를 먼저 선택하세요';
    if (isFetching) return '하위가구를 불러오는 중...';
    if (!furnitures || furnitures.length === 0) {
      return '선택 가능한 하위가구가 없습니다';
    }
    return '하위가구 선택...';
  })();

  return (
    <div className={ui.formStack}>
      <div className={shared.pickerRow}>
        <FurnitureTypeSelect
          label="상위가구 타입"
          value={furnitureTypeId}
          onChange={setFurnitureTypeId}
        />
        <label className={ui.field}>
          하위가구
          <select
            className={ui.input}
            value=""
            onChange={(e) => add(e.target.value)}
            disabled={!furnitures || furnitures.length === 0}
          >
            <option value="">{furniturePlaceholder}</option>
            {furnitures?.map((furniture) => (
              <option
                key={furniture.furnitureId}
                value={furniture.furnitureId}
                disabled={value.some(
                  (item) => item.furnitureId === furniture.furnitureId
                )}
              >
                {furniture.furnitureNameKr} (ID: {furniture.furnitureId})
              </option>
            ))}
          </select>
        </label>
      </div>
      {value.length > 0 ? (
        <div className={shared.tagList}>
          {value.map((furniture) => (
            <span key={furniture.furnitureId} className={ui.tag}>
              {furniture.furnitureTypeNameKr
                ? `${furniture.furnitureTypeNameKr} / `
                : ''}
              {furniture.furnitureNameKr} #{furniture.furnitureId}
              <button
                className={ui.tagRemoveButton}
                type="button"
                aria-label={`${furniture.furnitureNameKr} 삭제`}
                onClick={() =>
                  onChange(
                    value.filter(
                      ({ furnitureId }) => furnitureId !== furniture.furnitureId
                    )
                  )
                }
              >
                ×
              </button>
            </span>
          ))}
        </div>
      ) : (
        <span className={ui.helperText}>선택된 하위가구가 없습니다.</span>
      )}
    </div>
  );
}

export default FurniturePicker;
