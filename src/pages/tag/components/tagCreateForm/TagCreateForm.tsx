import { useState, type FormEvent } from 'react';

import { toast } from 'sonner';

import * as ui from '@styles/adminUi.css';

import { useCreateTagMutation } from '../../apis/mutations/useCreateTagMutation';
import {
  buildCreateTagPayload,
  createEmptyTagForm,
  type TagFormValues,
} from '../../utils/tagForm';
import TagFields from '../tagFields/TagFields';

function TagCreateForm() {
  const [values, setValues] = useState<TagFormValues>(createEmptyTagForm);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { mutate: createTag, isPending } = useCreateTagMutation();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let payload;
    try {
      payload = buildCreateTagPayload(values);
      setValidationError(null);
    } catch (error) {
      setValidationError(
        error instanceof Error ? error.message : '입력값을 확인해주세요.'
      );
      return;
    }

    createTag(payload, {
      onSuccess: () => {
        toast.success('태그가 생성되었습니다.');
        setValues(createEmptyTagForm());
      },
    });
  };

  return (
    <form className={ui.formStack} onSubmit={handleSubmit}>
      <div className={ui.fieldGrid}>
        <TagFields values={values} onChange={setValues} />
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
          태그 생성
        </button>
      </div>
    </form>
  );
}

export default TagCreateForm;
