import * as ui from '@styles/adminUi.css';

import * as styles from './PresetItemFields.css';

import type { PresetItemValue } from '../../utils/presetForm';

type EditableKey = Exclude<keyof PresetItemValue, 'key'>;

interface PresetItemFieldsProps {
  item: PresetItemValue;
  onChange: (item: PresetItemValue) => void;
  onRemove: () => void;
}

/** 칸 순서 · 이름은 SSR addPresetItem과 같다 */
const FIELDS: {
  key: EditableKey;
  label: string;
  span: 'sm' | 'md' | 'lg';
  type?: 'number';
  placeholder?: string;
}[] = [
  { key: 'source', label: '소스', span: 'sm', placeholder: 'EBAY' },
  { key: 'productId', label: 'productId', span: 'sm' },
  { key: 'title', label: '상품명', span: 'md' },
  { key: 'imageUrl', label: 'imageUrl', span: 'md' },
  { key: 'price', label: '가격', span: 'sm', type: 'number' },
  { key: 'currency', label: '통화', span: 'sm' },
  { key: 'siteName', label: '사이트명', span: 'sm' },
  { key: 'productUrl', label: 'productUrl', span: 'lg' },
  {
    key: 'priceUpdatedAt',
    label: 'priceUpdatedAt (ISO)',
    span: 'lg',
    placeholder: '2026-08-24T05:10:00Z',
  },
];

/** 유사상품 한 줄 입력 */
function PresetItemFields({ item, onChange, onRemove }: PresetItemFieldsProps) {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {FIELDS.map((field) => (
          <label
            key={field.key}
            className={`${ui.field} ${styles.span[field.span]}`}
          >
            {field.label}
            <input
              className={ui.input}
              type={field.type ?? 'text'}
              placeholder={field.placeholder}
              value={item[field.key]}
              onChange={(e) =>
                onChange({ ...item, [field.key]: e.target.value })
              }
            />
          </label>
        ))}
        <div className={styles.removeCell}>
          <button className={ui.button.danger} type="button" onClick={onRemove}>
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}

export default PresetItemFields;
