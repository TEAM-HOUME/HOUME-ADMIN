import * as ui from '@styles/adminUi.css';

import * as styles from './CheckboxGroup.css';

import type { Option } from '../../utils/floorPlanForm';

interface CheckboxGroupProps<T extends string> {
  legend: string;
  options: Option<T>[];
  value: T[];
  onChange: (next: T[]) => void;
}

/** 다중 선택 체크박스. 선택 순서와 상관없이 options 순서로 값을 유지한다 */
function CheckboxGroup<T extends string>({
  legend,
  options,
  value,
  onChange,
}: CheckboxGroupProps<T>) {
  const toggle = (optionValue: T, checked: boolean) => {
    const next = new Set(value);
    if (checked) next.add(optionValue);
    else next.delete(optionValue);
    onChange(options.map((o) => o.value).filter((v) => next.has(v)));
  };

  return (
    <fieldset className={ui.field}>
      <legend>{legend}</legend>
      <div className={styles.grid}>
        {options.map((option) => (
          <label key={option.value} className={styles.option}>
            <input
              type="checkbox"
              checked={value.includes(option.value)}
              onChange={(e) => toggle(option.value, e.target.checked)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default CheckboxGroup;
