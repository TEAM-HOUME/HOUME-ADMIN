import { useState, type FormEvent } from 'react';

import { toast } from 'sonner';

import * as ui from '@styles/adminUi.css';

import { useCreateRawProductMutation } from '../../apis/mutations/useCreateRawProductMutation';
import * as shared from '../../rawProduct.css';
import {
  buildCreateRawProductPayload,
  createEmptyBasicValues,
  type RawProductBasicValues,
  type RawProductMappingSelections,
} from '../../utils/rawProductForm';
import ColorPicker from '../colorPicker/ColorPicker';
import FurniturePicker from '../furniturePicker/FurniturePicker';
import FurnitureTagPicker from '../furnitureTagPicker/FurnitureTagPicker';
import RawProductBasicFields from '../rawProductBasicFields/RawProductBasicFields';

const createEmptySelections = (): RawProductMappingSelections => ({
  colors: [],
  furnitures: [],
  furnitureTags: [],
});

interface RawProductCreateFormProps {
  onCancel: () => void;
}

/** 신규 RAW 상품 등록 — 색상 · 하위가구 · Furniture Tag 매핑까지 한 번에 저장한다 */
function RawProductCreateForm({ onCancel }: RawProductCreateFormProps) {
  const [values, setValues] = useState<RawProductBasicValues>(
    createEmptyBasicValues
  );
  const [selections, setSelections] = useState(createEmptySelections);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { mutate: createRawProduct, isPending } = useCreateRawProductMutation();

  const updateSelections = (patch: Partial<RawProductMappingSelections>) =>
    setSelections((prev) => ({ ...prev, ...patch }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let payload;
    try {
      payload = buildCreateRawProductPayload(values, selections);
      setValidationError(null);
    } catch (error) {
      setValidationError(
        error instanceof Error ? error.message : '입력값을 확인해주세요.'
      );
      return;
    }

    createRawProduct(payload, {
      onSuccess: (created) => {
        toast.success(
          `RAW 상품(#${created.id ?? '-'})과 가구 매핑이 함께 등록되었습니다.`
        );
        setValues(createEmptyBasicValues());
        setSelections(createEmptySelections());
      },
    });
  };

  return (
    <form className={ui.formStack} onSubmit={handleSubmit}>
      <RawProductBasicFields
        values={values}
        onChange={(patch) => setValues((prev) => ({ ...prev, ...patch }))}
        mode="create"
      />
      <ColorPicker
        value={selections.colors}
        onChange={(colors) => updateSelections({ colors })}
      />
      <span className={ui.helperText}>
        표준 색상을 고르면 RAW 상품 등록과 동시에 색상이 저장됩니다.
      </span>

      <div className={shared.mappingBox}>
        <div>
          <p className={shared.mappingTitle}>가구 매핑</p>
          <p className={ui.helperText}>
            하위가구 기준 또는 Furniture Tag 기준으로 RAW 상품 등록과 동시에
            매핑합니다.
          </p>
        </div>
        <FurniturePicker
          value={selections.furnitures}
          onChange={(furnitures) => updateSelections({ furnitures })}
        />
        <FurnitureTagPicker
          value={selections.furnitureTags}
          onChange={(furnitureTags) => updateSelections({ furnitureTags })}
        />
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
          {isPending ? '등록 중...' : '상품 등록 완료'}
        </button>
        <button
          className={ui.button.secondary}
          type="button"
          onClick={onCancel}
        >
          취소
        </button>
      </div>
    </form>
  );
}

export default RawProductCreateForm;
