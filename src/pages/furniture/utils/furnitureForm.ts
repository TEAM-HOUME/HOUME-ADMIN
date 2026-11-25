import type { AdminFurnitureRequestDTO } from '@apis/__generated__/data-contracts';

import type { CreateFurniturePromptParams } from '../apis/mutations/useCreateFurniturePromptMutation';
import type { UpdateFurnitureParams } from '../apis/mutations/useUpdateFurnitureMutation';
import type { ForPlanParams } from '../apis/queries/useForPlanProductsQuery';

/** 목록에서 고른 가구-태그 연결. 가구 정보 수정은 (가구 한글 이름 + 태그 ID)로 대상을 찾는다 */
export interface FurnitureTagSelection {
  furnitureNameKr: string;
  tagId: number;
  searchKeyword: string;
  priority: string;
}

const parseInteger = (value: string) => {
  const parsed = Number(value);
  return value.trim() !== '' && Number.isInteger(parsed) ? parsed : null;
};

/* ---------- 신규 가구 등록 ---------- */

export interface FurnitureCreateValues {
  nameKr: string;
  nameEng: string;
  furnitureTypeId: string;
}

export const createEmptyFurnitureCreateValues = (): FurnitureCreateValues => ({
  nameKr: '',
  nameEng: '',
  furnitureTypeId: '',
});

export const buildCreateFurniturePayload = (
  values: FurnitureCreateValues
): AdminFurnitureRequestDTO => {
  const furnitureNameKr = values.nameKr.trim();
  const furnitureNameEng = values.nameEng.trim();
  const furnitureType = parseInteger(values.furnitureTypeId);
  if (!furnitureNameKr || !furnitureNameEng || furnitureType === null) {
    throw new Error('가구 이름(한글 · 영어)과 가구 타입을 모두 입력해주세요.');
  }
  return { furnitureNameKr, furnitureNameEng, furnitureType };
};

/* ---------- 가구 프롬프트 등록 ---------- */

export interface FurniturePromptCreateValues {
  furnitureNameKr: string;
  prompt: string;
  tagId: string;
  searchKeyword: string;
  priority: string;
  file: File | null;
  originalFilename: string;
}

export const createEmptyFurniturePromptValues =
  (): FurniturePromptCreateValues => ({
    furnitureNameKr: '',
    prompt: '',
    tagId: '',
    searchKeyword: '',
    priority: '0',
    file: null,
    originalFilename: '',
  });

/** 모든 항목 필수 (SSR은 HTML required로 막았다). 우선순위는 0 이상 정수 */
export const buildCreateFurniturePromptPayload = (
  values: FurniturePromptCreateValues
): CreateFurniturePromptParams => {
  const furnitureNameKr = values.furnitureNameKr.trim();
  const prompt = values.prompt.trim();
  const searchKeyword = values.searchKeyword.trim();
  const originalFilename = values.originalFilename.trim();
  const tagId = parseInteger(values.tagId);
  const priority = parseInteger(values.priority);

  if (!values.file || !values.file.type.startsWith('image/')) {
    throw new Error('가구 대표 이미지 파일을 선택해주세요.');
  }
  if (
    !furnitureNameKr ||
    !prompt ||
    tagId === null ||
    !searchKeyword ||
    !originalFilename
  ) {
    throw new Error(
      '가구 이름, 프롬프트, 스타일 태그, 검색 키워드, 원본 파일 이름을 모두 입력해주세요.'
    );
  }
  if (priority === null || priority < 0) {
    throw new Error('우선순위는 0 이상의 정수로 입력해주세요.');
  }

  return {
    file: values.file,
    furnitureNameKr,
    prompt,
    tagId,
    searchKeyword,
    priority,
    originalFilename,
  };
};

/* ---------- 가구 정보 수정 ---------- */

export interface FurnitureUpdateValues {
  furnitureNameKr: string;
  tagId: string;
  newFurnitureNameEng: string;
  newPrompt: string;
  newSearchKeyword: string;
  newPriority: string;
  file: File | null;
  originalFilename: string;
}

export const createFurnitureUpdateValues = (
  selection: FurnitureTagSelection | null
): FurnitureUpdateValues => ({
  furnitureNameKr: selection?.furnitureNameKr ?? '',
  tagId: selection ? String(selection.tagId) : '',
  newFurnitureNameEng: '',
  newPrompt: '',
  newSearchKeyword: selection?.searchKeyword ?? '',
  newPriority: selection?.priority ?? '',
  file: null,
  originalFilename: '',
});

/**
 * 수정 요청. 서버는 비어 있는 항목을 기존 값으로 유지한다.
 * 목록에서 고른 연결(original)이 있으면 채워 둔 키워드 · 우선순위 중 바뀐 것만 보낸다
 * (대상을 다른 가구 · 태그로 바꿔도 마찬가지).
 */
export const buildUpdateFurniturePayload = (
  values: FurnitureUpdateValues,
  original: FurnitureTagSelection | null
): UpdateFurnitureParams => {
  const furnitureNameKr = values.furnitureNameKr.trim();
  const tagId = parseInteger(values.tagId);
  if (!furnitureNameKr || tagId === null) {
    throw new Error('수정할 가구 이름(한글)과 태그를 입력해주세요.');
  }

  // 채워 둔 값(키워드 · 우선순위)을 그대로 둔 칸은 보내지 않는다.
  // 대상(가구 · 태그)을 바꿨을 때 원래 연결의 값이 다른 연결에 덮어써지지 않게 하려는 것이다
  const changed = (value: string, originalValue: string | undefined) => {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    if (originalValue?.trim() === trimmed) return undefined;
    return trimmed;
  };

  const newSearchKeyword = changed(
    values.newSearchKeyword,
    original?.searchKeyword
  );
  const priorityInput = changed(values.newPriority, original?.priority);
  const newPriority =
    priorityInput === undefined ? undefined : parseInteger(priorityInput);
  if (newPriority === null || (newPriority !== undefined && newPriority < 0)) {
    throw new Error('우선순위는 0 이상의 정수로 입력해주세요.');
  }
  if (values.file && !values.file.type.startsWith('image/')) {
    throw new Error('대표 이미지는 이미지 파일만 올릴 수 있습니다.');
  }

  const payload: UpdateFurnitureParams = {
    furnitureNameKr,
    tagId,
    newFurnitureNameEng: values.newFurnitureNameEng.trim() || undefined,
    newPrompt: values.newPrompt.trim() || undefined,
    newSearchKeyword,
    newPriority,
    file: values.file,
    originalFilename: values.file
      ? values.originalFilename.trim() || undefined
      : undefined,
  };

  const hasChange =
    payload.newFurnitureNameEng !== undefined ||
    payload.newPrompt !== undefined ||
    payload.newSearchKeyword !== undefined ||
    payload.newPriority !== undefined ||
    values.file !== null;
  if (!hasChange) {
    throw new Error('변경된 항목이 없습니다.');
  }

  return payload;
};

/* ---------- for-plan ---------- */

export interface ForPlanValues {
  tagId: string;
  furnitureId: string;
  searchKeyword: string;
  pHash: string;
  /** V2: 콤마로 구분 */
  allowedMalls: string;
  /** V2 */
  applyNaverPay: boolean;
}

export const createEmptyForPlanValues = (): ForPlanValues => ({
  tagId: '',
  furnitureId: '',
  searchKeyword: '',
  pHash: '50',
  allowedMalls: '',
  applyNaverPay: false,
});

export const buildForPlanParams = (
  version: ForPlanParams['version'],
  values: ForPlanValues
): ForPlanParams => {
  const tagId = parseInteger(values.tagId);
  const furnitureId = parseInteger(values.furnitureId);
  const pHash = parseInteger(values.pHash);
  const searchKeyword = values.searchKeyword.trim();

  if (tagId === null || furnitureId === null || !searchKeyword) {
    throw new Error('태그 ID, 가구 ID, 검색 키워드를 모두 입력해주세요.');
  }
  if (pHash === null || pHash < 0 || pHash > 100) {
    throw new Error('pHash는 0~100 사이의 정수로 입력해주세요.');
  }

  if (version === 'v1') {
    return { version, tagId, furnitureId, searchKeyword, pHash };
  }
  return {
    version,
    tagId,
    furnitureId,
    searchKeyword,
    pHash,
    allowedMalls: values.allowedMalls
      .split(',')
      .map((mall) => mall.trim())
      .filter((mall) => mall.length > 0),
    applyNaverPay: values.applyNaverPay,
  };
};
