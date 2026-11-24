import type {
  AdminBannerCreateRequest,
  AdminBannerMappedRawProductResponse,
  AdminBannerResponse,
  AdminBannerStyleAnswerChipRequest,
} from '@apis/__generated__/data-contracts';

/** 서버 기준 답변 칩 최대 개수 (`styleAnswerChips` maxItems 4, order 1~4) */
export const BANNER_CHIP_MAX_COUNT = 4;

/** 검색 결과·선택된 RAW 상품. 선택할 때는 id가 반드시 있어야 한다 */
export type BannerRawProduct = AdminBannerMappedRawProductResponse & {
  id: number;
};

export interface BannerChipFormValue {
  /** input 값 그대로 둔다. 숫자 검증은 제출할 때 한다 */
  order: string;
  label: string;
  selectedPrompt: string;
  rawProduct: BannerRawProduct | null;
}

export interface BannerFormValues {
  bannerImageUrl: string;
  bannerTitle: string;
  styleDescription: string;
  styleQuestion: string;
  stylePrompt: string;
  chips: BannerChipFormValue[];
  mappedRawProducts: BannerRawProduct[];
}

const createEmptyChip = (index: number): BannerChipFormValue => ({
  order: String(index + 1),
  label: '',
  selectedPrompt: '',
  rawProduct: null,
});

export const createEmptyBannerForm = (): BannerFormValues => ({
  bannerImageUrl: '',
  bannerTitle: '',
  styleDescription: '',
  styleQuestion: '',
  stylePrompt: '',
  chips: Array.from({ length: BANNER_CHIP_MAX_COUNT }, (_, index) =>
    createEmptyChip(index)
  ),
  mappedRawProducts: [],
});

export const hasRawProductId = (
  product: AdminBannerMappedRawProductResponse
): product is BannerRawProduct => product.id !== undefined;

/** 목록의 배너를 수정 폼 값으로 바꾼다 (SSR populateBannerForm과 같은 규칙) */
export const bannerToFormValues = (
  banner: AdminBannerResponse
): BannerFormValues => {
  const chips = createEmptyBannerForm().chips;

  (banner.styleAnswerChips ?? [])
    .slice(0, BANNER_CHIP_MAX_COUNT)
    .forEach((chip, index) => {
      chips[index] = {
        order: String(chip.order ?? index + 1),
        label: chip.label ?? '',
        selectedPrompt: chip.selectedPrompt ?? '',
        rawProduct:
          chip.curationRawProductId !== undefined
            ? {
                id: chip.curationRawProductId,
                productName:
                  chip.curationRawProductName ??
                  `RAW #${chip.curationRawProductId}`,
                productImageUrl: chip.curationRawProductImageUrl,
              }
            : null,
      };
    });

  return {
    bannerImageUrl: banner.bannerImageUrl ?? '',
    bannerTitle: banner.bannerTitle ?? '',
    styleDescription: banner.styleDescription ?? '',
    styleQuestion: banner.styleQuestion ?? '',
    stylePrompt: banner.stylePrompt ?? '',
    chips,
    mappedRawProducts: (banner.mappedRawProducts ?? []).filter(hasRawProductId),
  };
};

const isChipEmpty = (chip: BannerChipFormValue) =>
  chip.label.trim() === '' &&
  chip.selectedPrompt.trim() === '' &&
  chip.rawProduct === null;

/**
 * 폼 값을 생성·수정 요청 body로 바꾼다. 잘못된 값이면 화면에 보여줄 메시지로 Error를 던진다.
 * 규칙은 SSR buildBannerPayload와 같다:
 * - 비어 있는 칩(문구·프롬프트·상품 모두 없음)은 건너뛴다
 * - 일부만 채운 칩은 막는다. 순서는 1~4 정수
 */
export const buildBannerPayload = (
  values: BannerFormValues
): AdminBannerCreateRequest => {
  const styleAnswerChips: AdminBannerStyleAnswerChipRequest[] = [];

  values.chips.forEach((chip, index) => {
    if (isChipEmpty(chip)) return;

    const order = Number(chip.order);
    const label = chip.label.trim();
    const selectedPrompt = chip.selectedPrompt.trim();

    if (
      !label ||
      !selectedPrompt ||
      !chip.rawProduct ||
      !Number.isInteger(order)
    ) {
      throw new Error(
        `스타일 답변 칩 ${index + 1}의 문구, selected prompt, 순서, RAW 상품을 모두 입력해주세요.`
      );
    }
    if (order < 1 || order > BANNER_CHIP_MAX_COUNT) {
      throw new Error(
        `스타일 답변 칩 ${index + 1}의 순서는 1부터 ${BANNER_CHIP_MAX_COUNT} 사이여야 합니다.`
      );
    }

    styleAnswerChips.push({
      order,
      label,
      selectedPrompt,
      curationRawProductId: chip.rawProduct.id,
    });
  });

  if (!values.bannerImageUrl) {
    throw new Error('배너 이미지를 업로드해주세요.');
  }

  const bannerTitle = values.bannerTitle.trim();
  const styleDescription = values.styleDescription.trim();
  const styleQuestion = values.styleQuestion.trim();
  const stylePrompt = values.stylePrompt.trim();

  if (!bannerTitle || !styleDescription || !styleQuestion || !stylePrompt) {
    throw new Error(
      '배너 타이틀, 스타일 설명, 스타일 질문, 이미지 생성 스타일 프롬프트를 모두 입력해주세요.'
    );
  }

  return {
    bannerImageUrl: values.bannerImageUrl,
    bannerTitle,
    styleDescription,
    styleQuestion,
    stylePrompt,
    styleAnswerChips,
    mappedRawProductIds: values.mappedRawProducts.map((product) => product.id),
  };
};
