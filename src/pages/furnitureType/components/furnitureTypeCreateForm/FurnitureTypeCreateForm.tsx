import { useState, type FormEvent } from 'react';

import { toast } from 'sonner';

import * as ui from '@styles/adminUi.css';

import { useCreateFurnitureTypeMutation } from '../../apis/mutations/useCreateFurnitureTypeMutation';
import {
  buildCreateFurnitureTypePayload,
  createEmptyFurnitureTypeForm,
} from '../../utils/furnitureTypeForm';

function FurnitureTypeCreateForm() {
  const [values, setValues] = useState(createEmptyFurnitureTypeForm);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { mutate: createFurnitureType, isPending } =
    useCreateFurnitureTypeMutation();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let payload;
    try {
      payload = buildCreateFurnitureTypePayload(values);
      setValidationError(null);
    } catch (error) {
      setValidationError(
        error instanceof Error ? error.message : '입력값을 확인해주세요.'
      );
      return;
    }

    createFurnitureType(payload, {
      onSuccess: () => {
        toast.success('가구 타입이 등록되었습니다.');
        setValues(createEmptyFurnitureTypeForm());
      },
    });
  };

  return (
    <form className={ui.formStack} onSubmit={handleSubmit}>
      <div className={ui.fieldGrid}>
        <label className={ui.field}>
          가구 타입 이름 (한글)
          <input
            className={ui.input}
            value={values.nameKr}
            onChange={(e) => setValues({ ...values, nameKr: e.target.value })}
          />
        </label>
        <label className={ui.field}>
          가구 타입 이름 (영어)
          <input
            className={ui.input}
            value={values.nameEng}
            onChange={(e) => setValues({ ...values, nameEng: e.target.value })}
          />
          <span className={ui.helperText}>서버에 대문자로 저장됩니다.</span>
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
          가구 타입 등록
        </button>
      </div>
    </form>
  );
}

export default FurnitureTypeCreateForm;
