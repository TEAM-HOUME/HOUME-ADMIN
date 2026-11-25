import type {
  AdminTagGetResponseDTO,
  AdminTagRequestDTO,
  AdminTagUpdateRequestDTO,
} from '@apis/__generated__/data-contracts';

/** 서버 newTagNameEng(수정) 검증 패턴과 같다 (`^[a-zA-Z0-9\s\-_.()&/]*$`) */
const TAG_NAME_ENG_PATTERN = /^[a-zA-Z0-9\s\-_.()&/]*$/;

export interface TagFormValues {
  priority: string;
  tagName: string;
  tagNameKr: string;
  tagPrompt: string;
}

export const createEmptyTagForm = (): TagFormValues => ({
  priority: '',
  tagName: '',
  tagNameKr: '',
  tagPrompt: '',
});

export const tagToFormValues = (
  tag: AdminTagGetResponseDTO
): TagFormValues => ({
  priority: tag.priority !== undefined ? String(tag.priority) : '',
  tagName: tag.tagName ?? '',
  tagNameKr: tag.tag_name_kr ?? '',
  tagPrompt: tag.tag_prompt ?? '',
});

const parseInteger = (value: string) => {
  const parsed = Number(value);
  return value.trim() !== '' && Number.isInteger(parsed) ? parsed : null;
};

const assertTagNameEng = (value: string) => {
  if (!TAG_NAME_ENG_PATTERN.test(value)) {
    throw new Error(
      '태그 이름(영어)에는 영문 · 숫자 · 공백과 - _ . ( ) & / 만 쓸 수 있습니다.'
    );
  }
};

/** 생성 요청 body. 모든 항목 필수 (SSR은 HTML required로 막았다) */
export const buildCreateTagPayload = (
  values: TagFormValues
): AdminTagRequestDTO => {
  const priority = parseInteger(values.priority);
  const tagName = values.tagName.trim();
  const tagNameKr = values.tagNameKr.trim();
  const tagPrompt = values.tagPrompt.trim();

  if (priority === null || !tagName || !tagNameKr || !tagPrompt) {
    throw new Error(
      '우선순위(정수), 태그 이름(영어·한글), 태그 프롬프트를 모두 입력해주세요.'
    );
  }
  // 영문 이름 패턴은 서버가 수정(newTagNameEng)에만 검사한다 → 생성은 서버와 같게 막지 않는다

  return {
    priority,
    tagName,
    tag_name_kr: tagNameKr,
    tag_prompt: tagPrompt,
  };
};

/**
 * 수정 요청 body. 서버는 보내지 않은 항목을 기존 값으로 유지한다.
 * - 원본(목록에서 고른 태그)이 있으면: 원본과 달라진 항목만 보낸다
 * - 원본이 없으면(ID 직접 입력): SSR처럼 채운 항목만 보낸다
 */
export const buildUpdateTagPayload = (
  tagIdInput: string,
  values: TagFormValues,
  original: TagFormValues | null
): AdminTagUpdateRequestDTO => {
  const tagId = parseInteger(tagIdInput);
  if (tagId === null) {
    throw new Error('태그 ID를 입력해주세요.');
  }

  const pick = (key: keyof TagFormValues) => {
    const value = values[key].trim();
    if (!value) return undefined;
    if (original && original[key].trim() === value) return undefined;
    return value;
  };

  const priorityInput = pick('priority');
  const newPriority =
    priorityInput === undefined ? undefined : parseInteger(priorityInput);
  if (newPriority === null) {
    throw new Error('우선순위는 정수로 입력해주세요.');
  }

  const newTagNameEng = pick('tagName');
  if (newTagNameEng !== undefined) assertTagNameEng(newTagNameEng);

  const payload: AdminTagUpdateRequestDTO = {
    tagId,
    newPriority,
    newTagNameEng,
    newTagNameKr: pick('tagNameKr'),
    newTagPrompt: pick('tagPrompt'),
  };

  const hasChange = [
    payload.newPriority,
    payload.newTagNameEng,
    payload.newTagNameKr,
    payload.newTagPrompt,
  ].some((value) => value !== undefined);
  if (!hasChange) {
    throw new Error('변경된 항목이 없습니다.');
  }

  return payload;
};
