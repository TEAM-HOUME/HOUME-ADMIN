import { useState, type FormEvent } from 'react';

import { toast } from 'sonner';

import type { AdminBannerResponse } from '@apis/__generated__/data-contracts';

import ImageUploadField from '@components/imageUploadField/ImageUploadField';
import MappedRawProductPicker from '@components/mappedRawProductPicker/MappedRawProductPicker';

import { API_ENDPOINT } from '@constants/apiEndpoints';

import * as ui from '@styles/adminUi.css';

import * as styles from './BannerForm.css';
import { useCreateBannerMutation } from '../../apis/mutations/useCreateBannerMutation';
import { useUpdateBannerMutation } from '../../apis/mutations/useUpdateBannerMutation';
import {
  bannerToFormValues,
  buildBannerPayload,
  createEmptyBannerForm,
  type BannerChipFormValue,
  type BannerFormValues,
} from '../../utils/bannerForm';
import ChipEditor from '../chipEditor/ChipEditor';

interface BannerFormProps {
  /** 수정 중인 배너. null이면 등록 모드 */
  editingBanner: AdminBannerResponse | null;
  /** 폼 초기화 / 등록 완료 → 등록 모드로 돌아간다 */
  onReset: () => void;
}

/**
 * 배너 등록 / 수정 폼.
 * 부모가 key를 수정 대상 id로 주므로, 대상이 바뀌면 폼 state가 새로 만들어진다.
 */
function BannerForm({ editingBanner, onReset }: BannerFormProps) {
  const [values, setValues] = useState<BannerFormValues>(() =>
    editingBanner ? bannerToFormValues(editingBanner) : createEmptyBannerForm()
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const { mutate: createBanner, isPending: isCreating } =
    useCreateBannerMutation();
  const { mutate: updateBanner, isPending: isUpdating } =
    useUpdateBannerMutation();

  const isSubmitting = isCreating || isUpdating;
  const editingBannerId = editingBanner?.id;

  const update = (patch: Partial<BannerFormValues>) =>
    setValues((prev) => ({ ...prev, ...patch }));

  const updateChip = (index: number, chip: BannerChipFormValue) =>
    setValues((prev) => ({
      ...prev,
      chips: prev.chips.map((prevChip, i) => (i === index ? chip : prevChip)),
    }));

  /** 검증에 실패하면 메시지를 보여주고 null */
  const getPayload = () => {
    try {
      const payload = buildBannerPayload(values);
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

    createBanner(payload, {
      onSuccess: () => {
        toast.success('배너가 등록되었습니다.');
        onReset();
      },
    });
  };

  const handleUpdate = () => {
    if (editingBannerId === undefined) return;
    const payload = getPayload();
    if (!payload) return;

    updateBanner(
      { bannerId: editingBannerId, body: payload },
      { onSuccess: () => toast.success('배너가 수정되었습니다.') }
    );
  };

  return (
    <form className={styles.form} onSubmit={handleCreate}>
      <p className={ui.helperText}>
        배너 이미지를 기준으로 스타일 설명과 답변 칩, 매핑 상품을 관리합니다.
      </p>

      <div className={ui.fieldGrid}>
        <label className={ui.field}>
          수정 대상 배너 ID
          <input
            className={ui.input}
            value={editingBannerId ?? ''}
            placeholder="목록에서 수정 선택 시 자동 입력"
            readOnly
          />
        </label>
        <div className={ui.fullSpan}>
          <ImageUploadField
            label="배너 이미지 업로드"
            uploadEndpoint={API_ENDPOINT.BANNER.IMAGE_UPLOAD_URL}
            value={values.bannerImageUrl}
            onChange={(bannerImageUrl) => update({ bannerImageUrl })}
          />
        </div>
        <label className={ui.field}>
          배너 타이틀
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
        <label className={ui.field}>
          스타일 질문
          <input
            className={ui.input}
            value={values.styleQuestion}
            onChange={(e) => update({ styleQuestion: e.target.value })}
          />
        </label>
        <label className={`${ui.field} ${ui.fullSpan}`}>
          이미지 생성 스타일 프롬프트
          <textarea
            className={ui.textarea}
            value={values.stylePrompt}
            onChange={(e) => update({ stylePrompt: e.target.value })}
          />
        </label>
      </div>

      <section>
        <h3 className={ui.sectionTitle}>스타일 답변 칩 (최대 4개)</h3>
        <div className={styles.chipList}>
          {values.chips.map((chip, index) => (
            <ChipEditor
              // 칩 슬롯은 4칸 고정이라 index가 곧 정체성이다
              key={index}
              index={index}
              value={chip}
              onChange={(next) => updateChip(index, next)}
            />
          ))}
        </div>
      </section>

      <section>
        <h3 className={ui.sectionTitle}>배너에 매핑된 가구</h3>
        <MappedRawProductPicker
          searchEndpoint={API_ENDPOINT.BANNER.RAW_PRODUCT_SEARCH}
          value={values.mappedRawProducts}
          onChange={(mappedRawProducts) => update({ mappedRawProducts })}
          emptyText="아직 배너에 매핑된 가구가 없습니다."
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
          배너 등록
        </button>
        <button
          className={ui.button.secondary}
          type="button"
          onClick={handleUpdate}
          disabled={editingBannerId === undefined || isSubmitting}
        >
          배너 수정
        </button>
        <button className={ui.button.secondary} type="button" onClick={onReset}>
          폼 초기화
        </button>
      </div>
    </form>
  );
}

export default BannerForm;
