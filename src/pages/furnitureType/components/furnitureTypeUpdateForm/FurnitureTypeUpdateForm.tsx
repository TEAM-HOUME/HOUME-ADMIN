import { useState, type FormEvent } from 'react';

import { toast } from 'sonner';

import type { AdminFurnitureTypeResponse } from '@apis/__generated__/data-contracts';

import * as ui from '@styles/adminUi.css';

import { useUpdateFurnitureTypeMutation } from '../../apis/mutations/useUpdateFurnitureTypeMutation';
import {
  buildUpdateFurnitureTypePayload,
  createEmptyFurnitureTypeForm,
  furnitureTypeToFormValues,
  type FurnitureTypeFormValues,
} from '../../utils/furnitureTypeForm';

interface FurnitureTypeUpdateFormProps {
  /** 목록에서 '수정'으로 고른 타입. 없으면 ID를 직접 입력한다 */
  selectedType: AdminFurnitureTypeResponse | null;
  onReset: () => void;
}

/**
 * 가구 타입 정보 수정. 부모가 key를 고른 타입 id로 주므로 대상이 바뀌면 새로 만들어진다.
 * 바뀐 이름만 보내고, 나머지는 서버가 기존 값을 유지한다.
 */
function FurnitureTypeUpdateForm({
  selectedType,
  onReset,
}: FurnitureTypeUpdateFormProps) {
  const [original] = useState<FurnitureTypeFormValues | null>(() =>
    selectedType ? furnitureTypeToFormValues(selectedType) : null
  );
  const [typeId, setTypeId] = useState(
    selectedType?.furnitureTypeId !== undefined
      ? String(selectedType.furnitureTypeId)
      : ''
  );
  const [values, setValues] = useState<FurnitureTypeFormValues>(
    () => original ?? createEmptyFurnitureTypeForm()
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const { mutate: updateFurnitureType, isPending } =
    useUpdateFurnitureTypeMutation();

  // ID를 손으로 바꾸면 더 이상 고른 타입의 값과 비교할 수 없다
  const isEditingSelectedType =
    original !== null && typeId === String(selectedType?.furnitureTypeId);
  const labelPrefix = isEditingSelectedType ? '' : '새 ';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let payload;
    try {
      payload = buildUpdateFurnitureTypePayload(
        typeId,
        values,
        isEditingSelectedType ? original : null
      );
      setValidationError(null);
    } catch (error) {
      setValidationError(
        error instanceof Error ? error.message : '입력값을 확인해주세요.'
      );
      return;
    }

    updateFurnitureType(payload, {
      onSuccess: () => toast.success('가구 타입이 수정되었습니다.'),
    });
  };

  return (
    <form className={ui.formStack} onSubmit={handleSubmit}>
      <p className={ui.helperText}>
        {isEditingSelectedType
          ? '바뀐 이름만 저장됩니다.'
          : '목록에서 "수정"을 누르거나 가구 타입 ID를 입력하세요. 비워 둔 이름은 그대로 유지됩니다.'}
      </p>
      <div className={ui.fieldGrid}>
        <label className={ui.field}>
          가구 타입 ID
          <input
            className={ui.input}
            type="number"
            value={typeId}
            onChange={(e) => setTypeId(e.target.value)}
          />
        </label>
        <label className={ui.field}>
          {labelPrefix}가구 타입 이름 (한글)
          <input
            className={ui.input}
            value={values.nameKr}
            onChange={(e) => setValues({ ...values, nameKr: e.target.value })}
          />
        </label>
        <label className={ui.field}>
          {labelPrefix}가구 타입 이름 (영어)
          <input
            className={ui.input}
            value={values.nameEng}
            onChange={(e) => setValues({ ...values, nameEng: e.target.value })}
          />
        </label>
      </div>
      {validationError && (
        <p className={ui.errorText} role="alert">
          {validationError}
        </p>
      )}
      <div className={ui.buttonRow}>
        <button
          className={ui.button.primary}
          type="submit"
          disabled={isPending}
        >
          가구 타입 수정
        </button>
        <button className={ui.button.secondary} type="button" onClick={onReset}>
          폼 초기화
        </button>
      </div>
    </form>
  );
}

export default FurnitureTypeUpdateForm;
