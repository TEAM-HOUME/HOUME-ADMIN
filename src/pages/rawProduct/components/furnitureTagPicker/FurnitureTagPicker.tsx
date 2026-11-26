import * as ui from '@styles/adminUi.css';

import * as shared from '../../rawProduct.css';
import {
  formatFurnitureTagLabel,
  type SelectedFurnitureTag,
} from '../../utils/rawProductForm';
import FurnitureTagSelect from '../furnitureTagSelect/FurnitureTagSelect';

interface FurnitureTagPickerProps {
  value: SelectedFurnitureTag[];
  onChange: (next: SelectedFurnitureTag[]) => void;
}

/** Furniture Tag 매핑 여러 개 — 고르면 바로 추가되고, 칩의 ×로 뺀다 */
function FurnitureTagPicker({ value, onChange }: FurnitureTagPickerProps) {
  return (
    <div className={ui.formStack}>
      <FurnitureTagSelect
        disabledIds={value.map(({ furnitureTagId }) => furnitureTagId)}
        onSelect={(tag) => {
          if (
            value.some((item) => item.furnitureTagId === tag.furnitureTagId)
          ) {
            return;
          }
          onChange([...value, tag]);
        }}
      />
      {value.length > 0 ? (
        <div className={shared.tagList}>
          {value.map((tag) => (
            <span key={tag.furnitureTagId} className={ui.tag}>
              {formatFurnitureTagLabel(tag)}
              <button
                className={ui.tagRemoveButton}
                type="button"
                aria-label="삭제"
                onClick={() =>
                  onChange(
                    value.filter(
                      ({ furnitureTagId }) =>
                        furnitureTagId !== tag.furnitureTagId
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
        <span className={ui.helperText}>선택된 Furniture Tag가 없습니다.</span>
      )}
    </div>
  );
}

export default FurnitureTagPicker;
