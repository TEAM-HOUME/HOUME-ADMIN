import type {
  AdminFurnitureTypeRequest,
  AdminFurnitureTypeResponse,
  AdminUpdateFurnitureTypeRequest,
} from '@apis/__generated__/data-contracts';

export interface FurnitureTypeFormValues {
  nameKr: string;
  nameEng: string;
}

export const createEmptyFurnitureTypeForm = (): FurnitureTypeFormValues => ({
  nameKr: '',
  nameEng: '',
});

export const furnitureTypeToFormValues = (
  furnitureType: AdminFurnitureTypeResponse
): FurnitureTypeFormValues => ({
  nameKr: furnitureType.furnitureTypeNameKr ?? '',
  nameEng: furnitureType.furnitureTypeNameEng ?? '',
});

/** 등록 요청 body. 두 이름 모두 필수 (SSR은 HTML required로 막았다) */
export const buildCreateFurnitureTypePayload = (
  values: FurnitureTypeFormValues
): AdminFurnitureTypeRequest => {
  const furnitureTypeNameKr = values.nameKr.trim();
  const furnitureTypeNameEng = values.nameEng.trim();
  if (!furnitureTypeNameKr || !furnitureTypeNameEng) {
    throw new Error('가구 타입 이름(한글 · 영어)을 모두 입력해주세요.');
  }
  return { furnitureTypeNameKr, furnitureTypeNameEng };
};

/**
 * 수정 요청 body. 서버(AdminFurnitureServiceImpl.updateFurnitureType) 동작에 맞춘다:
 * - 빈 문자열("")인 항목은 기존 값을 유지한다
 * - 보낸 이름은 기존 값과 같아도 중복 검사에 걸린다 → 안 바뀐 항목은 반드시 ""로 보낸다
 * - 영어명을 null로 보내면 서버가 toUpperCase()에서 실패한다 → undefined 대신 ""
 * - 영어명은 대문자로 저장되므로 대소문자만 다른 값은 '안 바뀜'으로 본다
 *
 * 원본(목록에서 고른 타입)이 없으면(ID 직접 입력) SSR처럼 채운 항목만 보낸다.
 */
export const buildUpdateFurnitureTypePayload = (
  idInput: string,
  values: FurnitureTypeFormValues,
  original: FurnitureTypeFormValues | null
): AdminUpdateFurnitureTypeRequest => {
  const id = Number(idInput);
  if (idInput.trim() === '' || !Number.isInteger(id)) {
    throw new Error('가구 타입 ID를 입력해주세요.');
  }

  const nameKr = values.nameKr.trim();
  const nameEng = values.nameEng.trim();
  const isKrChanged =
    nameKr !== '' && (!original || nameKr !== original.nameKr.trim());
  const isEngChanged =
    nameEng !== '' &&
    (!original ||
      nameEng.toUpperCase() !== original.nameEng.trim().toUpperCase());

  if (!isKrChanged && !isEngChanged) {
    throw new Error('변경된 항목이 없습니다.');
  }

  return {
    id,
    furnitureTypeNameKr: isKrChanged ? nameKr : '',
    furnitureTypeNameEng: isEngChanged ? nameEng : '',
  };
};
