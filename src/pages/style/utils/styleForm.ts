import type { RawProduct } from '@shared/types/rawProduct';

import type {
  AdminStyleCreateRequest,
  AdminStyleResponse,
} from '@apis/__generated__/data-contracts';

import { hasRawProductId } from '@utils/hasRawProductId';

export interface StyleFormValues {
  bannerImageUrl: string;
  /** 화면 이름은 '스타일 이름'이지만 서버 필드는 bannerTitle */
  bannerTitle: string;
  styleDescription: string;
  stylePrompt: string;
  mappedRawProducts: RawProduct[];
}

export const createEmptyStyleForm = (): StyleFormValues => ({
  bannerImageUrl: '',
  bannerTitle: '',
  styleDescription: '',
  stylePrompt: '',
  mappedRawProducts: [],
});

/** 목록의 스타일을 수정 폼 값으로 바꾼다 (SSR populateStyleForm과 같은 규칙) */
export const styleToFormValues = (
  style: AdminStyleResponse
): StyleFormValues => ({
  bannerImageUrl: style.bannerImageUrl ?? '',
  bannerTitle: style.bannerTitle ?? '',
  styleDescription: style.styleDescription ?? '',
  stylePrompt: style.stylePrompt ?? '',
  mappedRawProducts: (style.mappedRawProducts ?? []).filter(hasRawProductId),
});

/**
 * 폼 값을 생성·수정 요청 body로 바꾼다. 잘못된 값이면 화면에 보여줄 메시지로 Error를 던진다.
 * SSR은 이미지만 스크립트로 검사하고 나머지는 HTML required로 막았다 → 둘 다 여기서 검사한다.
 */
export const buildStylePayload = (
  values: StyleFormValues
): AdminStyleCreateRequest => {
  if (!values.bannerImageUrl) {
    throw new Error('스타일 이미지를 업로드해주세요.');
  }

  const bannerTitle = values.bannerTitle.trim();
  const styleDescription = values.styleDescription.trim();
  const stylePrompt = values.stylePrompt.trim();

  if (!bannerTitle || !styleDescription || !stylePrompt) {
    throw new Error(
      '스타일 이름, 스타일 설명, 스타일 참고 프롬프트를 모두 입력해주세요.'
    );
  }

  return {
    bannerImageUrl: values.bannerImageUrl,
    bannerTitle,
    styleDescription,
    stylePrompt,
    mappedRawProductIds: values.mappedRawProducts.map((product) => product.id),
  };
};
