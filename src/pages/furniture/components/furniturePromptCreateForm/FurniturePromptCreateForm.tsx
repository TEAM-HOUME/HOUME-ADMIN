import { useId, useRef, useState, type FormEvent } from 'react';

import { toast } from 'sonner';

import * as ui from '@styles/adminUi.css';

import { getApiErrorMessage } from '@utils/getApiErrorMessage';

import { useCreateFurniturePromptMutation } from '../../apis/mutations/useCreateFurniturePromptMutation';
import { useFurnitureListQuery } from '../../apis/queries/useFurnitureListQuery';
import {
  buildCreateFurniturePromptPayload,
  createEmptyFurniturePromptValues,
  type FurniturePromptCreateValues,
} from '../../utils/furnitureForm';
import TagSelect from '../tagSelect/TagSelect';

/**
 * 가구 프롬프트 등록 — 가구에 스타일 태그를 연결하고 대표 이미지를 올린다.
 * 서버가 연결을 만들며 presignedUrl을 주고, 그 URL로 이미지를 PUT한다.
 */
function FurniturePromptCreateForm() {
  const furnitureListId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState(createEmptyFurniturePromptValues);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { data: furnitures } = useFurnitureListQuery();
  const {
    mutate: createPrompt,
    isPending,
    error,
    reset,
  } = useCreateFurniturePromptMutation();

  const update = (patch: Partial<FurniturePromptCreateValues>) =>
    setValues((prev) => ({ ...prev, ...patch }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    reset();
    let payload;
    try {
      payload = buildCreateFurniturePromptPayload(values);
      setValidationError(null);
    } catch (validation) {
      setValidationError(
        validation instanceof Error
          ? validation.message
          : '입력값을 확인해주세요.'
      );
      return;
    }

    createPrompt(payload, {
      onSuccess: () => {
        toast.success('프롬프트와 이미지 등록이 완료되었습니다.');
        setValues(createEmptyFurniturePromptValues());
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
    });
  };

  return (
    <form className={ui.formStack} onSubmit={handleSubmit}>
      <div className={ui.fieldGrid}>
        <label className={ui.field}>
          가구 이름 (한글)
          <input
            className={ui.input}
            list={furnitureListId}
            value={values.furnitureNameKr}
            onChange={(e) => update({ furnitureNameKr: e.target.value })}
            placeholder="등록된 가구 이름"
          />
          <datalist id={furnitureListId}>
            {furnitures?.map((furniture) => (
              <option
                key={furniture.furnitureId}
                value={furniture.furnitureNameKr}
              />
            ))}
          </datalist>
        </label>
        <TagSelect
          label="스타일 태그"
          value={values.tagId}
          onChange={(tagId) => update({ tagId })}
        />
        <label className={ui.field}>
          검색 키워드
          <input
            className={ui.input}
            value={values.searchKeyword}
            onChange={(e) => update({ searchKeyword: e.target.value })}
            placeholder="예: 침대, 수납, 원목"
          />
        </label>
        <label className={`${ui.field} ${ui.fullSpan}`}>
          프롬프트
          <textarea
            className={ui.textarea}
            value={values.prompt}
            onChange={(e) => update({ prompt: e.target.value })}
          />
        </label>
        <label className={ui.field}>
          우선순위
          <input
            className={ui.input}
            type="number"
            min={0}
            value={values.priority}
            onChange={(e) => update({ priority: e.target.value })}
          />
        </label>
        <label className={ui.field}>
          가구 대표 이미지
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
          />
        </label>
      </div>
      {(validationError ?? error) && (
        <p className={ui.errorText} role="alert">
          {validationError ??
            getApiErrorMessage(error, '프롬프트 등록 중 오류가 발생했습니다.')}
        </p>
      )}
      <div className={ui.buttonRow}>
        <button
          className={ui.button.primary}
          type="submit"
          disabled={isPending}
        >
          {isPending ? '등록 중...' : '프롬프트 등록'}
        </button>
      </div>
    </form>
  );
}

export default FurniturePromptCreateForm;
