import type {
  PresetDetailResponse,
  SavePresetRequest,
} from '@apis/__generated__/data-contracts';

/** 유사상품 한 줄 — 입력칸 값 그대로(문자열) 들고 있다 */
export interface PresetItemValue {
  /** 목록에서 지우고 다시 그릴 때 쓰는 화면용 키 */
  key: number;
  source: string;
  productId: string;
  title: string;
  imageUrl: string;
  price: string;
  currency: string;
  siteName: string;
  productUrl: string;
  priceUpdatedAt: string;
}

export interface PresetFormValues {
  sourceUrl: string;
  title: string;
  thumbnailUrl: string;
  brand: string;
  price: string;
  currency: string;
  similarProducts: PresetItemValue[];
}

let nextItemKey = 0;

export const createPresetItem = (
  data: Partial<Omit<PresetItemValue, 'key'>> = {}
): PresetItemValue => ({
  key: nextItemKey++,
  source: data.source ?? '',
  productId: data.productId ?? '',
  title: data.title ?? '',
  imageUrl: data.imageUrl ?? '',
  price: data.price ?? '',
  currency: data.currency ?? 'KRW',
  siteName: data.siteName ?? '',
  productUrl: data.productUrl ?? '',
  priceUpdatedAt: data.priceUpdatedAt ?? '',
});

export const EMPTY_PRESET_FORM: PresetFormValues = {
  sourceUrl: '',
  title: '',
  thumbnailUrl: '',
  brand: '',
  price: '',
  currency: 'KRW',
  similarProducts: [],
};

/** 상세 응답 → 폼 값 (SSR loadPresetForEdit과 같음) */
export const toPresetFormValues = ({
  originalProduct = {},
  similarProducts = [],
}: PresetDetailResponse): PresetFormValues => ({
  sourceUrl: originalProduct.sourceUrl ?? '',
  title: originalProduct.title ?? '',
  thumbnailUrl: originalProduct.thumbnailUrl ?? '',
  brand: originalProduct.brand ?? '',
  // SSR은 0도 빈칸으로 둔다 (`price || ''`)
  price: originalProduct.price ? String(originalProduct.price) : '',
  currency: originalProduct.currency || 'KRW',
  similarProducts: similarProducts.map((item) =>
    createPresetItem({
      source: item.source,
      productId: item.productId,
      title: item.title,
      imageUrl: item.imageUrl,
      price: item.price ? String(item.price) : '',
      currency: item.currency || 'KRW',
      siteName: item.siteName,
      productUrl: item.productUrl,
      priceUpdatedAt: item.priceUpdatedAt,
    })
  ),
});

/**
 * 폼 값 → 저장 요청 (SSR submitPreset · collectPresetItems와 같음).
 * 필수값 검사는 서버(@Valid)에 맡기고 응답을 그대로 보여준다.
 * 유사상품 가격이 비면 NaN → JSON에서 null로 가서 서버가 거절한다 (SSR과 같음).
 */
export const toSavePresetRequest = (
  values: PresetFormValues
): SavePresetRequest => ({
  sourceUrl: values.sourceUrl.trim(),
  title: values.title.trim(),
  thumbnailUrl: values.thumbnailUrl.trim(),
  brand: values.brand.trim() || undefined,
  price: values.price ? Number.parseInt(values.price, 10) : undefined,
  currency: values.currency.trim() || 'KRW',
  similarProducts: values.similarProducts.map((item) => ({
    source: item.source.trim(),
    productId: item.productId.trim(),
    title: item.title.trim(),
    imageUrl: item.imageUrl.trim() || undefined,
    price: Number.parseFloat(item.price),
    currency: item.currency.trim(),
    siteName: item.siteName.trim() || undefined,
    productUrl: item.productUrl.trim(),
    priceUpdatedAt: item.priceUpdatedAt.trim(),
  })),
});
