import { useState, type FormEvent } from 'react';

import { toast } from 'sonner';

import type { AdminTagGetResponseDTO } from '@apis/__generated__/data-contracts';

import * as ui from '@styles/adminUi.css';

import { useUpdateTagMutation } from '../../apis/mutations/useUpdateTagMutation';
import {
  buildUpdateTagPayload,
  createEmptyTagForm,
  tagToFormValues,
  type TagFormValues,
} from '../../utils/tagForm';
import TagFields from '../tagFields/TagFields';

interface TagUpdateFormProps {
  /** 목록에서 '수정'으로 고른 태그. 없으면 ID를 직접 입력한다 */
  selectedTag: AdminTagGetResponseDTO | null;
  onReset: () => void;
}

/**
 * 태그 수정. 부모가 key를 고른 태그 id로 주므로 대상이 바뀌면 새로 만들어진다.
 * 바뀐 항목만 보내고, 나머지는 서버가 기존 값을 유지한다.
 */
function TagUpdateForm({ selectedTag, onReset }: TagUpdateFormProps) {
  const [original] = useState<TagFormValues | null>(() =>
    selectedTag ? tagToFormValues(selectedTag) : null
  );
  const [tagId, setTagId] = useState(
    selectedTag?.id !== undefined ? String(selectedTag.id) : ''
  );
  const [values, setValues] = useState<TagFormValues>(
    () => original ?? createEmptyTagForm()
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const { mutate: updateTag, isPending } = useUpdateTagMutation();

  // ID를 손으로 바꾸면 더 이상 고른 태그의 값과 비교할 수 없다
  const isEditingSelectedTag =
    original !== null && tagId === String(selectedTag?.id);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let payload;
    try {
      payload = buildUpdateTagPayload(
        tagId,
        values,
        isEditingSelectedTag ? original : null
      );
      setValidationError(null);
    } catch (error) {
      setValidationError(
        error instanceof Error ? error.message : '입력값을 확인해주세요.'
      );
      return;
    }

    updateTag(payload, {
      onSuccess: () => toast.success('태그가 수정되었습니다.'),
    });
  };

  return (
    <form className={ui.formStack} onSubmit={handleSubmit}>
      <p className={ui.helperText}>
        {isEditingSelectedTag
          ? '바뀐 항목만 저장됩니다.'
          : '목록에서 "수정"을 누르거나 태그 ID를 입력하세요. 비워 둔 항목은 그대로 유지됩니다.'}
      </p>
      <div className={ui.fieldGrid}>
        <label className={ui.field}>
          태그 ID
          <input
            className={ui.input}
            type="number"
            value={tagId}
            onChange={(e) => setTagId(e.target.value)}
          />
        </label>
        <div className={ui.fullSpan} />
        <TagFields
          values={values}
          onChange={setValues}
          labelPrefix={isEditingSelectedTag ? '' : '새 '}
        />
      </div>
      {validationError && (
        <p className={ui.errorText} role="alert">
          {validationError}
        </p>
      )}
      <div className={ui.buttonRow}>
        <button
          className={ui.button.primary}
          type="submit"
          disabled={isPending}
        >
          태그 수정
        </button>
        <button className={ui.button.secondary} type="button" onClick={onReset}>
          폼 초기화
        </button>
      </div>
    </form>
  );
}

export default TagUpdateForm;
