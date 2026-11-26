import { useState, type FormEvent } from 'react';

import { toast } from 'sonner';

import type { AdminCurationRawProductResponse } from '@apis/__generated__/data-contracts';

import * as ui from '@styles/adminUi.css';

import { useUpdateRawProductMutation } from '../../apis/mutations/useUpdateRawProductMutation';
import * as shared from '../../rawProduct.css';
import {
  buildUpdateRawProductPayload,
  colorsFromProduct,
  furnituresFromProduct,
  furnitureTagsFromProduct,
  productToBasicValues,
  type RawProductBasicValues,
  type RawProductMappingSelections,
  type RawProductReplaceFlags,
} from '../../utils/rawProductForm';
import ColorPicker from '../colorPicker/ColorPicker';
import FurniturePicker from '../furniturePicker/FurniturePicker';
import FurnitureTagPicker from '../furnitureTagPicker/FurnitureTagPicker';
import RawProductBasicFields from '../rawProductBasicFields/RawProductBasicFields';

interface RawProductUpdateFormProps {
  product: AdminCurationRawProductResponse & { id: number };
}

/**
 * 선택 상품 정보 수정 (SSR과 같은 규칙).
 * - 기본 정보: 비우면 기존 값 유지
 * - 색상 · 하위가구 · Furniture Tag: '수정 반영'을 켠 것만 통째로 교체 (바꾸면 자동으로 켜진다)
 * 부모가 상세가 새로 올 때마다 key를 바꿔 이 폼을 새로 만든다.
 */
function RawProductUpdateForm({ product }: RawProductUpdateFormProps) {
  const [values, setValues] = useState<RawProductBasicValues>(() =>
    productToBasicValues(product)
  );
  const [selections, setSelections] = useState<RawProductMappingSelections>(
    () => ({
      colors: colorsFromProduct(product.colors, undefined),
      furnitures: furnituresFromProduct(product),
      furnitureTags: furnitureTagsFromProduct(product),
    })
  );
  const [replace, setReplace] = useState<RawProductReplaceFlags>({
    colors: false,
    furnitures: false,
    furnitureTags: false,
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const { mutate: updateRawProduct, isPending } = useUpdateRawProductMutation();

  /** 선택을 바꾸면 그 항목의 '수정 반영'을 자동으로 켠다 (SSR markRawMappingChanged) */
  const changeSelection = <K extends keyof RawProductMappingSelections>(
    key: K,
    next: RawProductMappingSelections[K]
  ) => {
    setSelections((prev) => ({ ...prev, [key]: next }));
    setReplace((prev) => ({ ...prev, [key]: true }));
  };

  const replaceCheckbox = (
    key: keyof RawProductReplaceFlags,
    label: string
  ) => (
    <label className={shared.checkboxLabel}>
      <input
        type="checkbox"
        checked={replace[key]}
        onChange={(e) =>
          setReplace((prev) => ({ ...prev, [key]: e.target.checked }))
        }
      />
      {label}
    </label>
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let body;
    try {
      body = buildUpdateRawProductPayload(values, selections, replace);
      setValidationError(null);
    } catch (error) {
      setValidationError(
        error instanceof Error ? error.message : '입력값을 확인해주세요.'
      );
      return;
    }

    const clearing = [
      replace.colors && selections.colors.length === 0 && '색상',
      replace.furnitures &&
        selections.furnitures.length === 0 &&
        '하위가구 매핑',
      replace.furnitureTags &&
        selections.furnitureTags.length === 0 &&
        'Furniture Tag 매핑',
    ].filter(Boolean);
    if (
      clearing.length > 0 &&
      !window.confirm(
        `${clearing.join(', ')}이(가) 전부 삭제됩니다. 계속할까요?`
      )
    ) {
      return;
    }

    updateRawProduct(
      { rawProductId: product.id, body },
      { onSuccess: () => toast.success('RAW 상품 정보가 수정되었습니다.') }
    );
  };

  return (
    <form className={ui.formStack} onSubmit={handleSubmit}>
      <p className={ui.helperText}>
        비워 둔 항목은 기존 값이 유지됩니다. (수정 대상 System ID #{product.id})
      </p>
      <RawProductBasicFields
        values={values}
        onChange={(patch) => setValues((prev) => ({ ...prev, ...patch }))}
        mode="update"
      />

      <div className={shared.mappingBox}>
        <ColorPicker
          value={selections.colors}
          onChange={(colors) => changeSelection('colors', colors)}
        />
        {replaceCheckbox('colors', '색상 수정 반영')}
        <span className={ui.helperText}>
          체크한 상태에서 선택된 색상이 없으면 색상이 전부 삭제됩니다.
        </span>
      </div>

      <div className={shared.mappingBox}>
        <div>
          <p className={shared.mappingTitle}>가구 매핑 교체</p>
          <p className={ui.helperText}>
            체크한 항목만 저장 시 통째로 교체됩니다. 체크한 채로 비워서 저장하면
            해당 매핑이 전부 삭제됩니다.
          </p>
        </div>
        {replaceCheckbox('furnitures', '하위가구 매핑 수정 반영')}
        <FurniturePicker
          value={selections.furnitures}
          onChange={(furnitures) => changeSelection('furnitures', furnitures)}
        />
        {replaceCheckbox('furnitureTags', 'Furniture Tag 매핑 수정 반영')}
        <FurnitureTagPicker
          value={selections.furnitureTags}
          onChange={(furnitureTags) =>
            changeSelection('furnitureTags', furnitureTags)
          }
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
          {isPending ? '저장 중...' : '정보 수정 저장'}
        </button>
      </div>
    </form>
  );
}

export default RawProductUpdateForm;
