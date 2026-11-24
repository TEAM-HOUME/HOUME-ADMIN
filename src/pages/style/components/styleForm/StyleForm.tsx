import { useState, type FormEvent } from 'react';

import { toast } from 'sonner';

import type { AdminStyleResponse } from '@apis/__generated__/data-contracts';

import ImageUploadField from '@components/imageUploadField/ImageUploadField';
import MappedRawProductPicker from '@components/mappedRawProductPicker/MappedRawProductPicker';

import { API_ENDPOINT } from '@constants/apiEndpoints';

import * as ui from '@styles/adminUi.css';

import * as styles from './StyleForm.css';
import { useCreateStyleMutation } from '../../apis/mutations/useCreateStyleMutation';
import { useUpdateStyleMutation } from '../../apis/mutations/useUpdateStyleMutation';
import {
  buildStylePayload,
  createEmptyStyleForm,
  styleToFormValues,
  type StyleFormValues,
} from '../../utils/styleForm';

interface StyleFormProps {
  /** 수정 중인 스타일. null이면 등록 모드 */
  editingStyle: AdminStyleResponse | null;
  /** 폼 초기화 / 등록 완료 → 등록 모드로 돌아간다 */
  onReset: () => void;
}

/**
 * 스타일 등록 / 수정 폼.
 * 부모가 key를 수정 대상 id로 주므로, 대상이 바뀌면 폼 state가 새로 만들어진다.
 */
function StyleForm({ editingStyle, onReset }: StyleFormProps) {
  const [values, setValues] = useState<StyleFormValues>(() =>
    editingStyle ? styleToFormValues(editingStyle) : createEmptyStyleForm()
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const { mutate: createStyle, isPending: isCreating } =
    useCreateStyleMutation();
  const { mutate: updateStyle, isPending: isUpdating } =
    useUpdateStyleMutation();

  const isSubmitting = isCreating || isUpdating;
  const editingStyleId = editingStyle?.id;

  const update = (patch: Partial<StyleFormValues>) =>
    setValues((prev) => ({ ...prev, ...patch }));

  /** 검증에 실패하면 메시지를 보여주고 null */
  const getPayload = () => {
    try {
      const payload = buildStylePayload(values);
      setValidationError(null);
      return payload;
    } catch (error) {
      setValidationError(
        error instanceof Error ? error.message : '입력값을 확인해주세요.'
      );
      return null;
    }
  };

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = getPayload();
    if (!payload) return;

    createStyle(payload, {
      onSuccess: () => {
        toast.success('스타일이 등록되었습니다.');
        onReset();
      },
    });
  };

  const handleUpdate = () => {
    if (editingStyleId === undefined) return;
    const payload = getPayload();
    if (!payload) return;

    updateStyle(
      { styleId: editingStyleId, body: payload },
      { onSuccess: () => toast.success('스타일이 수정되었습니다.') }
    );
  };

  return (
    <form className={styles.form} onSubmit={handleCreate}>
      <div className={ui.fieldGrid}>
        <label className={ui.field}>
          수정 대상 스타일 ID
          <input
            className={ui.input}
            value={editingStyleId ?? ''}
            placeholder="목록에서 수정 선택 시 자동 입력"
            readOnly
          />
        </label>
        <div className={ui.fullSpan}>
          <ImageUploadField
            label="스타일 이미지 업로드"
            uploadEndpoint={API_ENDPOINT.STYLE.IMAGE_UPLOAD_URL}
            value={values.bannerImageUrl}
            onChange={(bannerImageUrl) => update({ bannerImageUrl })}
          />
        </div>
        <label className={ui.field}>
          스타일 이름
          <input
            className={ui.input}
            value={values.bannerTitle}
            onChange={(e) => update({ bannerTitle: e.target.value })}
          />
        </label>
        <label className={ui.field}>
          스타일 설명
          <input
            className={ui.input}
            value={values.styleDescription}
            onChange={(e) => update({ styleDescription: e.target.value })}
          />
        </label>
        <label className={`${ui.field} ${ui.fullSpan}`}>
          스타일 참고 프롬프트
          <textarea
            className={ui.textarea}
            value={values.stylePrompt}
            onChange={(e) => update({ stylePrompt: e.target.value })}
          />
        </label>
      </div>

      <section>
        <h3 className={ui.sectionTitle}>스타일에 매핑된 가구</h3>
        <MappedRawProductPicker
          searchEndpoint={API_ENDPOINT.STYLE.RAW_PRODUCT_SEARCH}
          value={values.mappedRawProducts}
          onChange={(mappedRawProducts) => update({ mappedRawProducts })}
          emptyText="아직 스타일에 매핑된 가구가 없습니다."
        />
      </section>

      {validationError && (
        <p className={ui.errorText} role="alert">
          {validationError}
        </p>
      )}

      <div className={ui.buttonRow}>
        <button
          className={ui.button.primary}
          type="submit"
          disabled={isSubmitting}
        >
          스타일 등록
        </button>
        <button
          className={ui.button.secondary}
          type="button"
          onClick={handleUpdate}
          disabled={editingStyleId === undefined || isSubmitting}
        >
          스타일 수정
        </button>
        <button className={ui.button.secondary} type="button" onClick={onReset}>
          폼 초기화
        </button>
      </div>
    </form>
  );
}

export default StyleForm;
