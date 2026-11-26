import * as ui from '@styles/adminUi.css';

import { useRawColorOptionsQuery } from '../../apis/queries/useRawColorOptionsQuery';
import * as shared from '../../rawProduct.css';

import type { SelectedColor } from '../../utils/rawProductForm';

interface ColorPickerProps {
  value: SelectedColor[];
  onChange: (next: SelectedColor[]) => void;
}

/** 표준 색상 선택 — 드롭다운에서 고르면 바로 추가되고, 칩의 ×로 뺀다 */
function ColorPicker({ value, onChange }: ColorPickerProps) {
  const { data: options, isPending, isError } = useRawColorOptionsQuery();

  const add = (label: string) => {
    if (!label || value.some((color) => color.label === label)) return;
    const option = options?.find((item) => item.label === label);
    onChange([...value, { label, hex: option?.value }]);
  };

  return (
    <div className={ui.field}>
      Colors
      <select
        className={ui.input}
        value=""
        onChange={(e) => add(e.target.value)}
        disabled={isPending || isError}
      >
        <option value="">
          {isError
            ? '색상 옵션 로딩 실패'
            : isPending
              ? '색상을 불러오는 중...'
              : '색상 선택...'}
        </option>
        {options?.map((option) => (
          <option
            key={option.label}
            value={option.label}
            disabled={value.some((color) => color.label === option.label)}
          >
            {option.label}
          </option>
        ))}
      </select>
      {value.length > 0 ? (
        <div className={shared.tagList}>
          {value.map((color) => {
            // 상품에서 불러온 색상은 옵션이 늦게 와서 hex가 비어 있을 수 있다
            const hex =
              color.hex ??
              options?.find((option) => option.label === color.label)?.value;
            return (
              <span key={color.label} className={ui.tag}>
                {hex && (
                  <span
                    className={shared.colorDot}
                    style={{ backgroundColor: hex }}
                  />
                )}
                {color.label}
                <button
                  className={ui.tagRemoveButton}
                  type="button"
                  aria-label={`${color.label} 삭제`}
                  onClick={() =>
                    onChange(value.filter(({ label }) => label !== color.label))
                  }
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      ) : (
        <span className={ui.helperText}>선택된 색상이 없습니다.</span>
      )}
    </div>
  );
}

export default ColorPicker;
