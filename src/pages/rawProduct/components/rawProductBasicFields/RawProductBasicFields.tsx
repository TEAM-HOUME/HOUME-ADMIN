import * as ui from '@styles/adminUi.css';

import * as shared from '../../rawProduct.css';
import {
  CATEGORY_OPTIONS,
  type RawProductBasicValues,
} from '../../utils/rawProductForm';

interface RawProductBasicFieldsProps {
  values: RawProductBasicValues;
  onChange: (patch: Partial<RawProductBasicValues>) => void;
  /**
   * create: 필수 항목 표시, 노출 기본값 '노출'
   * update: 카테고리 · 노출에 '미변경' 선택지, 무료배송 조건 · 수집 시각 입력 추가 (SSR과 같은 구성)
   */
  mode: 'create' | 'update';
}

/** RAW 상품 기본 정보 · 가격 입력칸 (등록 · 수정 폼 공용) */
function RawProductBasicFields({
  values,
  onChange,
  mode,
}: RawProductBasicFieldsProps) {
  const isCreate = mode === 'create';
  const required = isCreate ? ' *' : '';

  const text = (
    key: keyof RawProductBasicValues,
    label: string,
    options: { type?: string; className?: string; placeholder?: string } = {}
  ) => (
    <label className={`${ui.field} ${options.className ?? ''}`}>
      {label}
      <input
        className={ui.input}
        type={options.type ?? 'text'}
        value={values[key]}
        onChange={(e) => onChange({ [key]: e.target.value })}
        placeholder={options.placeholder}
      />
    </label>
  );

  return (
    <div className={shared.fourColumns}>
      {text('source', `Source${required}`, {
        placeholder: '예: soozip, ohouse',
      })}
      <label className={ui.field}>
        Category{required}
        <select
          className={ui.input}
          value={values.category}
          onChange={(e) => onChange({ category: e.target.value })}
        >
          <option value="">{isCreate ? '카테고리 선택...' : '미변경'}</option>
          {CATEGORY_OPTIONS.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
      {text('productId', `External Product ID${required}`, { type: 'number' })}
      {text('productMallName', 'Mall Name')}
      {text('productName', `Product Name${required}`, {
        className: ui.fullSpan,
      })}
      {text('productImageUrl', `Image URL${required}`, {
        type: 'url',
        className: ui.fullSpan,
      })}
      {text('productSiteUrl', `Site URL${required}`, {
        type: 'url',
        className: ui.fullSpan,
      })}
      {text('brand', 'Brand')}
      <label className={ui.field}>
        Exposure Status
        <select
          className={ui.input}
          value={values.isExposed}
          onChange={(e) => onChange({ isExposed: e.target.value })}
        >
          {!isCreate && <option value="">미변경</option>}
          <option value="true">노출</option>
          <option value="false">숨김</option>
        </select>
      </label>
      {isCreate ? (
        <div className={shared.twoSpan} />
      ) : (
        <>
          {text('fetchedAt', 'Last Fetched At', { type: 'datetime-local' })}
          <div />
        </>
      )}
      {text('listPrice', 'List Price', { type: 'number' })}
      {text('discountRate', 'Discount %', { type: 'number' })}
      {text('discountPrice', 'Discount Price', { type: 'number' })}
      {text('baseShippingFee', 'Shipping Fee', { type: 'number' })}
      {!isCreate &&
        text('freeShippingCondition', 'Free Shipping Condition', {
          type: 'number',
        })}
    </div>
  );
}

export default RawProductBasicFields;
