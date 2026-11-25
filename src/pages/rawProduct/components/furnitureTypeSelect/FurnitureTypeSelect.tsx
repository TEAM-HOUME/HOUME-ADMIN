import { useFurnitureTypeListQuery } from '@apis/queries/useFurnitureTypeListQuery';

import * as ui from '@styles/adminUi.css';

interface FurnitureTypeSelectProps {
  label: string;
  value: number | null;
  onChange: (furnitureTypeId: number | null) => void;
}

/** 가구 타입(상위가구) 드롭다운 */
function FurnitureTypeSelect({
  label,
  value,
  onChange,
}: FurnitureTypeSelectProps) {
  const { data: furnitureTypes, isPending } = useFurnitureTypeListQuery();

  return (
    <label className={ui.field}>
      {label}
      <select
        className={ui.input}
        value={value ?? ''}
        onChange={(e) =>
          onChange(e.target.value === '' ? null : Number(e.target.value))
        }
        disabled={isPending}
      >
        <option value="">
          {isPending ? '가구 타입을 불러오는 중...' : '가구 타입 선택...'}
        </option>
        {furnitureTypes?.map((type) => (
          <option key={type.furnitureTypeId} value={type.furnitureTypeId}>
            {type.furnitureTypeNameKr} ({type.furnitureTypeNameEng})
          </option>
        ))}
      </select>
    </label>
  );
}

export default FurnitureTypeSelect;
