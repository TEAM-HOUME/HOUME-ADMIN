import { useState } from 'react';

import { isAxiosError } from 'axios';

import * as ui from '@styles/adminUi.css';

import * as styles from './PresetForm.css';
import { useSavePresetMutation } from '../../apis/mutations/useSavePresetMutation';
import {
  createPresetItem,
  toSavePresetRequest,
  type PresetFormValues,
  type PresetItemValue,
} from '../../utils/presetForm';
import PresetItemFields from '../presetItemFields/PresetItemFields';

interface PresetFormProps {
  /** 수정 중인 프리셋 ID. null이면 신규 등록 */
  editingId: number | null;
  initialValues: PresetFormValues;
  onReset: () => void;
}

type BasicKey = Exclude<keyof PresetFormValues, 'similarProducts'>;

const BASIC_FIELDS: {
  key: BasicKey;
  label: string;
  span: 'half' | 'quarter' | 'sixth';
  type?: 'url' | 'number';
  placeholder?: string;
}[] = [
  {
    key: 'sourceUrl',
    label: '원본 상품 URL *',
    span: 'half',
    type: 'url',
    placeholder: 'https://www.ohou.se/...',
  },
  { key: 'title', label: '상품명 *', span: 'half' },
  { key: 'thumbnailUrl', label: '썸네일 URL *', span: 'half', type: 'url' },
  { key: 'brand', label: '브랜드', span: 'quarter' },
  {
    key: 'price',
    label: '가격 (원)',
    span: 'quarter',
    type: 'number',
    placeholder: '299000',
  },
  { key: 'currency', label: '통화', span: 'sixth' },
];

/** 서버 응답 바디를 SSR처럼 JSON 그대로 보여준다 (검증 실패 내용 확인용) */
const stringifyResponse = (body: unknown) => JSON.stringify(body, null, 2);

/** 신규 프리셋 등록 / 프리셋 수정 */
function PresetForm({ editingId, initialValues, onReset }: PresetFormProps) {
  const [values, setValues] = useState(initialValues);
  const {
    mutate: savePreset,
    isPending,
    data: response,
    error,
    isSuccess,
    isError,
  } = useSavePresetMutation();

  const updateItem = (item: PresetItemValue) =>
    setValues((prev) => ({
      ...prev,
      similarProducts: prev.similarProducts.map((current) =>
        current.key === item.key ? item : current
      ),
    }));

  const removeItem = (key: number) =>
    setValues((prev) => ({
      ...prev,
      similarProducts: prev.similarProducts.filter((item) => item.key !== key),
    }));

  const addItem = () =>
    setValues((prev) => ({
      ...prev,
      similarProducts: [...prev.similarProducts, createPresetItem()],
    }));

  const handleSubmit = () => {
    savePreset({ presetId: editingId, body: toSavePresetRequest(values) });
  };

  const renderResult = () => {
    if (isPending) return <pre className={ui.readonlyBox}>저장 중...</pre>;
    if (isSuccess) {
      return (
        <pre className={ui.readonlyBox}>{stringifyResponse(response.data)}</pre>
      );
    }
    if (isError) {
      const body: unknown = isAxiosError<unknown>(error)
        ? error.response?.data
        : undefined;
      return (
        <pre className={`${ui.readonlyBox} ${styles.errorBox}`} role="alert">
          {body === undefined
            ? `오류: ${error.message}`
            : stringifyResponse(body)}
        </pre>
      );
    }
    return null;
  };

  return (
    <div className={ui.formStack}>
      <div className={styles.basicGrid}>
        {BASIC_FIELDS.map((field) => (
          <label
            key={field.key}
            className={`${ui.field} ${styles.span[field.span]}`}
          >
            {field.label}
            <input
              className={ui.input}
              type={field.type ?? 'text'}
              placeholder={field.placeholder}
              value={values[field.key]}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, [field.key]: e.target.value }))
              }
            />
          </label>
        ))}
      </div>

      <div className={styles.items}>
        <div className={styles.itemsHeader}>
          <span className={ui.sectionTitle}>유사상품 목록</span>
          <button
            className={ui.button.secondary}
            type="button"
            onClick={addItem}
          >
            + 항목 추가
          </button>
        </div>
        {values.similarProducts.map((item) => (
          <PresetItemFields
            key={item.key}
            item={item}
            onChange={updateItem}
            onRemove={() => removeItem(item.key)}
          />
        ))}
      </div>

      <div className={ui.buttonRow}>
        <button
          className={ui.button.primary}
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
        >
          저장
        </button>
        <button className={ui.button.secondary} type="button" onClick={onReset}>
          초기화
        </button>
      </div>

      {renderResult()}
    </div>
  );
}

export default PresetForm;
