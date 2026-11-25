import { useRef, useState, type FormEvent } from 'react';

import { toast } from 'sonner';

import * as ui from '@styles/adminUi.css';

import { getApiErrorMessage } from '@utils/getApiErrorMessage';

import { useUpdateFurnitureMutation } from '../../apis/mutations/useUpdateFurnitureMutation';
import { useFurniturePromptQuery } from '../../apis/queries/useFurniturePromptQuery';
import {
  buildUpdateFurniturePayload,
  createFurnitureUpdateValues,
  type FurnitureTagSelection,
  type FurnitureUpdateValues,
} from '../../utils/furnitureForm';
import TagSelect from '../tagSelect/TagSelect';

interface FurnitureUpdateFormProps {
  /** 목록에서 '수정'으로 고른 가구-태그 연결. 없으면 직접 입력한다 */
  selection: FurnitureTagSelection | null;
  onReset: () => void;
}

/**
 * 가구 정보 수정. 대상은 (가구 한글 이름 + 태그)로 찾는다.
 * 비워 둔 항목은 서버가 기존 값을 유지한다. 부모가 key로 대상이 바뀔 때마다 새로 만든다.
 */
function FurnitureUpdateForm({ selection, onReset }: FurnitureUpdateFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<FurnitureUpdateValues>(() =>
    createFurnitureUpdateValues(selection)
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const {
    mutate: updateFurniture,
    isPending,
    error,
    reset,
  } = useUpdateFurnitureMutation();
  // 고른 연결의 현재 프롬프트를 보여준다 (새 프롬프트를 비우면 이게 유지된다)
  const { data: currentPrompt, isPending: isPromptPending } =
    useFurniturePromptQuery(
      selection
        ? { furnitureNameKr: selection.furnitureNameKr, tagId: selection.tagId }
        : null
    );

  const update = (patch: Partial<FurnitureUpdateValues>) =>
    setValues((prev) => ({ ...prev, ...patch }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    reset();
    let payload;
    try {
      payload = buildUpdateFurniturePayload(values, selection);
      setValidationError(null);
    } catch (validation) {
      setValidationError(
        validation instanceof Error
          ? validation.message
          : '입력값을 확인해주세요.'
      );
      return;
    }

    updateFurniture(payload, {
      onSuccess: () => {
        toast.success('가구 정보가 수정되었습니다.');
        update({ file: null, originalFilename: '' });
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
    });
  };

  return (
    <form className={ui.formStack} onSubmit={handleSubmit}>
      <p className={ui.helperText}>
        목록의 태그 옆 &quot;수정&quot;을 누르거나 가구 이름과 태그를 직접
        고르세요. 비워 둔 항목은 그대로 유지됩니다.
      </p>
      <div className={ui.fieldGrid}>
        <label className={ui.field}>
          가구 이름 (한글)
          <input
            className={ui.input}
            value={values.furnitureNameKr}
            onChange={(e) => update({ furnitureNameKr: e.target.value })}
          />
        </label>
        <TagSelect
          label="태그"
          value={values.tagId}
          onChange={(tagId) => update({ tagId })}
        />
        <label className={ui.field}>
          새 가구 이름 (영어)
          <input
            className={ui.input}
            value={values.newFurnitureNameEng}
            onChange={(e) => update({ newFurnitureNameEng: e.target.value })}
          />
        </label>
        {selection && (
          <div className={`${ui.field} ${ui.fullSpan}`}>
            현재 프롬프트
            <p className={ui.readonlyBox}>
              {isPromptPending ? '불러오는 중...' : currentPrompt || '-'}
            </p>
          </div>
        )}
        <label className={`${ui.field} ${ui.fullSpan}`}>
          새 프롬프트
          <textarea
            className={ui.textarea}
            value={values.newPrompt}
            onChange={(e) => update({ newPrompt: e.target.value })}
            placeholder="비워 두면 현재 프롬프트를 유지합니다."
          />
        </label>
        <label className={ui.field}>
          검색 키워드
          <input
            className={ui.input}
            value={values.newSearchKeyword}
            onChange={(e) => update({ newSearchKeyword: e.target.value })}
            placeholder="예: 침대, 수납, 원목"
          />
        </label>
        <label className={ui.field}>
          우선순위
          <input
            className={ui.input}
            type="number"
            min={0}
            value={values.newPriority}
            onChange={(e) => update({ newPriority: e.target.value })}
          />
        </label>
        <div />
        <label className={ui.field}>
          대표 이미지 교체
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => update({ file: e.target.files?.[0] ?? null })}
          />
        </label>
        <label className={ui.field}>
          원본 파일 이름 (표시용)
          <input
            className={ui.input}
            value={values.originalFilename}
            onChange={(e) => update({ originalFilename: e.target.value })}
            placeholder="예: 북유럽 원목 침대"
            disabled={!values.file}
          />
        </label>
      </div>
      {(validationError ?? error) && (
        <p className={ui.errorText} role="alert">
          {validationError ??
            getApiErrorMessage(error, '가구 정보 수정 중 오류가 발생했습니다.')}
        </p>
      )}
      <div className={ui.buttonRow}>
        <button
          className={ui.button.primary}
          type="submit"
          disabled={isPending}
        >
          {isPending ? '수정 중...' : '가구 정보 수정'}
        </button>
        <button className={ui.button.secondary} type="button" onClick={onReset}>
          폼 초기화
        </button>
      </div>
    </form>
  );
}

export default FurnitureUpdateForm;
