import type {
  AdminCurationRawProductColorOptionResponse,
  AdminCurationRawProductColorRequest,
  AdminCurationRawProductColorResponse,
  AdminCurationRawProductCreateRequest,
  AdminCurationRawProductResponse,
  AdminCurationRawProductUpdateRequest,
  AdminFurnitureTagOptionResponse,
} from '@apis/__generated__/data-contracts';

export type RawProductCategory =
  AdminCurationRawProductCreateRequest['category'];

/** 서버 SoozipCategory. SSR과 같이 값 그대로 보여준다 */
export const CATEGORY_OPTIONS: RawProductCategory[] = [
  'MINI_ELECTRONICS',
  'FURNITURE',
  'LIGHTING',
  'LIVING_GOODS',
  'HOME_FABRIC',
  'ACCESSORY',
];

export const isRawProductCategory = (
  value: string
): value is RawProductCategory =>
  (CATEGORY_OPTIONS as string[]).includes(value);

/* ---------- 선택 항목 (색상 · 하위가구 · Furniture Tag) ---------- */

export interface SelectedColor {
  label: string;
  /** 표준 색상의 hex. 옵션에 없는 색상이면 없다 */
  hex?: string;
}

export interface SelectedFurniture {
  furnitureId: number;
  furnitureNameKr: string;
  furnitureTypeNameKr?: string;
}

export type SelectedFurnitureTag = AdminFurnitureTagOptionResponse & {
  furnitureTagId: number;
};

/** furniture_tag 표시 이름: 태그명 → 검색 키워드 → id 순으로 쓴다 (SSR getRawFurnitureTagDisplayName) */
export const getFurnitureTagDisplayName = (tag: {
  tagNameKr?: string;
  searchKeyword?: string;
  furnitureTagId?: number;
}) =>
  tag.tagNameKr ||
  tag.searchKeyword ||
  `FurnitureTag #${tag.furnitureTagId ?? '-'}`;

export const formatFurnitureTagLabel = (tag: {
  furnitureNameKr?: string;
  tagNameKr?: string;
  searchKeyword?: string;
  furnitureTagId?: number;
}) =>
  `${tag.furnitureNameKr || '-'} / ${getFurnitureTagDisplayName(tag)} (FT#${tag.furnitureTagId ?? '-'})`;

/** 상품의 색상을 선택 목록으로 바꾼다. 이름이 같은 색상은 하나만 남긴다 */
export const colorsFromProduct = (
  colors: AdminCurationRawProductColorResponse[] | undefined,
  options: AdminCurationRawProductColorOptionResponse[] | undefined
): SelectedColor[] => {
  const result: SelectedColor[] = [];
  (colors ?? []).forEach((color) => {
    const label = (color.clientColorName || color.rawColorName || '').trim();
    if (!label || result.some((selected) => selected.label === label)) return;
    result.push({
      label,
      hex: options?.find((option) => option.label === label)?.value,
    });
  });
  return result;
};

/** 표준 색상 이름을 raw · client 이름 둘 다로 보낸다 (SSR buildRawProductColorRequests) */
export const toColorRequests = (
  colors: SelectedColor[]
): AdminCurationRawProductColorRequest[] =>
  colors.map(({ label }) => ({ rawColorName: label, clientColorName: label }));

export const furnituresFromProduct = (
  product: AdminCurationRawProductResponse
): SelectedFurniture[] =>
  (product.furnitures ?? []).flatMap((furniture) =>
    furniture.furnitureId === undefined
      ? []
      : [
          {
            furnitureId: furniture.furnitureId,
            furnitureNameKr: furniture.furnitureNameKr ?? '-',
            furnitureTypeNameKr: furniture.furnitureTypeNameKr,
          },
        ]
  );

export const furnitureTagsFromProduct = (
  product: AdminCurationRawProductResponse
): SelectedFurnitureTag[] =>
  (product.furnitureTags ?? []).flatMap((tag) =>
    tag.furnitureTagId === undefined
      ? []
      : [{ ...tag, furnitureTagId: tag.furnitureTagId }]
  );

/* ---------- 기본 정보 입력값 ---------- */

export interface RawProductBasicValues {
  source: string;
  /** 수정 폼에서는 ''이 '미변경' */
  category: string;
  productId: string;
  productName: string;
  productImageUrl: string;
  productSiteUrl: string;
  productMallName: string;
  brand: string;
  listPrice: string;
  discountRate: string;
  discountPrice: string;
  baseShippingFee: string;
  freeShippingCondition: string;
  /** 'true' · 'false' · ''(수정 폼의 '미변경') */
  isExposed: string;
  /** datetime-local 값 (YYYY-MM-DDTHH:mm) */
  fetchedAt: string;
}

export const createEmptyBasicValues = (): RawProductBasicValues => ({
  source: '',
  category: '',
  productId: '',
  productName: '',
  productImageUrl: '',
  productSiteUrl: '',
  productMallName: '',
  brand: '',
  listPrice: '',
  discountRate: '',
  discountPrice: '',
  baseShippingFee: '',
  freeShippingCondition: '',
  isExposed: 'true',
  fetchedAt: '',
});

const toInput = (value: number | string | undefined | null) =>
  value === undefined || value === null ? '' : String(value);

/** 서버 LocalDateTime 문자열을 datetime-local 입력값으로 (분 단위까지) */
export const toDateTimeLocalValue = (value: string | undefined) =>
  value ? value.replace(' ', 'T').slice(0, 16) : '';

export const productToBasicValues = (
  product: AdminCurationRawProductResponse
): RawProductBasicValues => ({
  source: product.source ?? '',
  category: product.category ?? '',
  productId: toInput(product.productId),
  productName: product.productName ?? '',
  productImageUrl: product.productImageUrl ?? '',
  productSiteUrl: product.productSiteUrl ?? '',
  productMallName: product.productMallName ?? '',
  brand: product.brand ?? '',
  listPrice: toInput(product.listPrice),
  discountRate: toInput(product.discountRate),
  discountPrice: toInput(product.discountPrice),
  baseShippingFee: toInput(product.baseShippingFee),
  freeShippingCondition: toInput(product.freeShippingCondition),
  isExposed: product.isExposed === undefined ? '' : String(product.isExposed),
  fetchedAt: toDateTimeLocalValue(product.fetchedAt),
});

/** 비어 있으면 undefined, 숫자가 아니면 에러 */
const parseOptionalNumber = (value: string, label: string) => {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const parsed = Number(trimmed);
  if (Number.isNaN(parsed)) {
    throw new Error(`${label}은(는) 숫자로 입력해주세요.`);
  }
  return parsed;
};

const optionalText = (value: string) => value.trim() || undefined;

/** 기본 정보 중 비어 있지 않은 항목만 모은다 (숫자 검증 포함) */
const collectBasicFields = (values: RawProductBasicValues) => {
  const discountRate = parseOptionalNumber(values.discountRate, '할인율');
  if (discountRate !== undefined && (discountRate < 0 || discountRate > 100)) {
    throw new Error('할인율은 0~100 사이로 입력해주세요.');
  }
  const category = values.category.trim();

  return {
    source: optionalText(values.source),
    category: isRawProductCategory(category) ? category : undefined,
    productId: parseOptionalNumber(values.productId, 'External Product ID'),
    productName: optionalText(values.productName),
    productImageUrl: optionalText(values.productImageUrl),
    productSiteUrl: optionalText(values.productSiteUrl),
    productMallName: optionalText(values.productMallName),
    brand: optionalText(values.brand),
    listPrice: parseOptionalNumber(values.listPrice, '정가'),
    discountRate,
    discountPrice: parseOptionalNumber(values.discountPrice, '할인가'),
    baseShippingFee: parseOptionalNumber(values.baseShippingFee, '배송비'),
    freeShippingCondition: parseOptionalNumber(
      values.freeShippingCondition,
      '무료배송 조건'
    ),
    isExposed:
      values.isExposed === 'true'
        ? true
        : values.isExposed === 'false'
          ? false
          : undefined,
    fetchedAt: optionalText(values.fetchedAt),
  };
};

/** 비어 있는(undefined) 키를 지운다 — 수정 요청에서 '보내지 않음'을 확실히 하려고 */
const omitUndefined = <T extends object>(value: T): T =>
  Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined)
  ) as T;

export interface RawProductMappingSelections {
  colors: SelectedColor[];
  furnitures: SelectedFurniture[];
  furnitureTags: SelectedFurnitureTag[];
}

/**
 * 등록 요청 body. Source · Category · Product ID · 이름 · 이미지 URL · 사이트 URL 필수
 * (SSR은 HTML required로 막았다). 색상 · 매핑은 등록과 동시에 저장된다.
 */
export const buildCreateRawProductPayload = (
  values: RawProductBasicValues,
  selections: RawProductMappingSelections
): AdminCurationRawProductCreateRequest => {
  const fields = collectBasicFields(values);
  const {
    source,
    category,
    productId,
    productName,
    productImageUrl,
    productSiteUrl,
  } = fields;

  if (
    !source ||
    !category ||
    productId === undefined ||
    !productName ||
    !productImageUrl ||
    !productSiteUrl
  ) {
    throw new Error(
      'Source, Category, External Product ID, Product Name, Image URL, Site URL을 모두 입력해주세요.'
    );
  }

  return omitUndefined({
    ...fields,
    source,
    category,
    productId,
    productName,
    productImageUrl,
    productSiteUrl,
    colors: toColorRequests(selections.colors),
    furnitureIds: selections.furnitures.map(({ furnitureId }) => furnitureId),
    furnitureTagIds: selections.furnitureTags.map(
      ({ furnitureTagId }) => furnitureTagId
    ),
  });
};

/** 색상 · 매핑 중 '수정 반영'을 켠 것만 보낸다. 켰는데 비어 있으면 전부 지워진다 */
export interface RawProductReplaceFlags {
  colors: boolean;
  furnitures: boolean;
  furnitureTags: boolean;
}

/**
 * 수정 요청 body (SSR buildRawProductUpdatePayload와 같은 규칙).
 * - 기본 정보: 비어 있지 않은 항목만 보낸다 (비우면 기존 값 유지)
 * - 색상 · 하위가구 · Furniture Tag: '수정 반영'을 켠 것만 통째로 교체한다
 */
export const buildUpdateRawProductPayload = (
  values: RawProductBasicValues,
  selections: RawProductMappingSelections,
  replace: RawProductReplaceFlags
): AdminCurationRawProductUpdateRequest => {
  const payload: AdminCurationRawProductUpdateRequest = omitUndefined({
    ...collectBasicFields(values),
    colors: replace.colors ? toColorRequests(selections.colors) : undefined,
    furnitureIds: replace.furnitures
      ? selections.furnitures.map(({ furnitureId }) => furnitureId)
      : undefined,
    furnitureTagIds: replace.furnitureTags
      ? selections.furnitureTags.map(({ furnitureTagId }) => furnitureTagId)
      : undefined,
  });

  if (Object.keys(payload).length === 0) {
    throw new Error('수정할 값을 최소 1개 이상 입력해주세요.');
  }
  return payload;
};

/* ---------- 목록 필터 ---------- */

export interface RawProductFilterValues {
  category: string;
  minListPrice: string;
  maxListPrice: string;
}

export const createEmptyFilterValues = (): RawProductFilterValues => ({
  category: '',
  minListPrice: '',
  maxListPrice: '',
});

/** 필터 입력을 조회 조건으로 바꾼다. 가격은 0 이상, 최소 ≤ 최대 (SSR과 같은 검사) */
export const buildRawProductFilter = (values: RawProductFilterValues) => {
  const minListPrice = parseOptionalNumber(values.minListPrice, '최소 가격');
  const maxListPrice = parseOptionalNumber(values.maxListPrice, '최대 가격');
  if (minListPrice !== undefined && minListPrice < 0) {
    throw new Error('최소 가격은 0 이상이어야 합니다.');
  }
  if (maxListPrice !== undefined && maxListPrice < 0) {
    throw new Error('최대 가격은 0 이상이어야 합니다.');
  }
  if (
    minListPrice !== undefined &&
    maxListPrice !== undefined &&
    minListPrice > maxListPrice
  ) {
    throw new Error('최소 가격은 최대 가격보다 클 수 없습니다.');
  }
  return {
    category: isRawProductCategory(values.category)
      ? values.category
      : undefined,
    minListPrice,
    maxListPrice,
  };
};

/* ---------- 표시 ---------- */

export const formatPrice = (value: number | null | undefined) =>
  value === undefined || value === null ? '-' : value.toLocaleString('ko-KR');

export const formatDateTime = (value: string | undefined) => {
  if (!value) return '-';
  const date = new Date(value.replace(' ', 'T'));
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('ko-KR');
};

/** ID 입력값을 양의 정수로. 아니면 null */
export const parseRawProductId = (value: string) => {
  const id = Number(value);
  return value.trim() !== '' && Number.isInteger(id) && id > 0 ? id : null;
};
