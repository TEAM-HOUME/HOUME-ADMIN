import { useState, type FormEvent } from 'react';

import { toast } from 'sonner';

import { useFurnitureTypeListQuery } from '@apis/queries/useFurnitureTypeListQuery';

import * as ui from '@styles/adminUi.css';

import { useCreateFurnitureMutation } from '../../apis/mutations/useCreateFurnitureMutation';
import {
  buildCreateFurniturePayload,
  createEmptyFurnitureCreateValues,
} from '../../utils/furnitureForm';

/** 신규 가구 등록 — 한글 · 영어 이름 + 가구 타입 */
function FurnitureCreateForm() {
  const [values, setValues] = useState(createEmptyFurnitureCreateValues);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { data: furnitureTypes, isPending: isTypesPending } =
    useFurnitureTypeListQuery();
  const { mutate: createFurniture, isPending } = useCreateFurnitureMutation();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let payload;
    try {
      payload = buildCreateFurniturePayload(values);
      setValidationError(null);
    } catch (error) {
      setValidationError(
        error instanceof Error ? error.message : '입력값을 확인해주세요.'
      );
      return;
    }

    createFurniture(payload, {
      onSuccess: () => {
        toast.success('가구가 등록되었습니다.');
        setValues(createEmptyFurnitureCreateValues());
      },
    });
  };

  return (
    <form className={ui.formStack} onSubmit={handleSubmit}>
      <div className={ui.fieldGrid}>
        <label className={ui.field}>
          가구 이름 (한글)
          <input
            className={ui.input}
            value={values.nameKr}
            onChange={(e) => setValues({ ...values, nameKr: e.target.value })}
          />
        </label>
        <label className={ui.field}>
          가구 이름 (영어)
          <input
            className={ui.input}
            value={values.nameEng}
            onChange={(e) => setValues({ ...values, nameEng: e.target.value })}
          />
        </label>
        <label className={ui.field}>
          가구 타입 선택
          <select
            className={ui.input}
            value={values.furnitureTypeId}
            onChange={(e) =>
              setValues({ ...values, furnitureTypeId: e.target.value })
            }
            disabled={isTypesPending}
          >
            <option value="" disabled>
              {isTypesPending
                ? '가구 타입을 불러오는 중...'
                : '가구 타입을 선택하세요...'}
            </option>
            {furnitureTypes?.map((type) => (
              <option key={type.furnitureTypeId} value={type.furnitureTypeId}>
                {type.furnitureTypeNameKr} ({type.furnitureTypeNameEng})
              </option>
            ))}
          </select>
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
          가구 등록
        </button>
      </div>
    </form>
  );
}

export default FurnitureCreateForm;
