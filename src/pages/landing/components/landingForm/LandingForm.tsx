import { useState, type FormEvent } from 'react';

import { toast } from 'sonner';

import type {
  AdminLandingCreateRequest,
  AdminLandingResponse,
} from '@apis/__generated__/data-contracts';

import ImageUploadField from '@components/imageUploadField/ImageUploadField';

import { API_ENDPOINT } from '@constants/apiEndpoints';

import * as ui from '@styles/adminUi.css';

import * as styles from './LandingForm.css';
import { useCreateLandingMutation } from '../../apis/mutations/useCreateLandingMutation';
import { useUpdateLandingMutation } from '../../apis/mutations/useUpdateLandingMutation';

interface LandingFormProps {
  /** 수정 중인 랜딩. null이면 등록 모드 */
  editingLanding: AdminLandingResponse | null;
  /** 폼 초기화 / 등록 완료 → 등록 모드로 돌아간다 */
  onReset: () => void;
}

/**
 * 랜딩 등록 / 수정 폼. 랜딩은 이미지와 타이틀만 관리한다.
 * 부모가 key를 수정 대상 id로 주므로, 대상이 바뀌면 폼 state가 새로 만들어진다.
 */
function LandingForm({ editingLanding, onReset }: LandingFormProps) {
  const [bannerImageUrl, setBannerImageUrl] = useState(
    editingLanding?.bannerImageUrl ?? ''
  );
  const [bannerTitle, setBannerTitle] = useState(
    editingLanding?.bannerTitle ?? ''
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const { mutate: createLanding, isPending: isCreating } =
    useCreateLandingMutation();
  const { mutate: updateLanding, isPending: isUpdating } =
    useUpdateLandingMutation();

  const isSubmitting = isCreating || isUpdating;
  const editingLandingId = editingLanding?.id;

  /** 검증에 실패하면 메시지를 보여주고 null (SSR buildLandingPayload와 같은 규칙) */
  const getPayload = (): AdminLandingCreateRequest | null => {
    const title = bannerTitle.trim();
    if (!bannerImageUrl) {
      setValidationError('랜딩 이미지를 업로드해주세요.');
      return null;
    }
    if (!title) {
      setValidationError('랜딩 타이틀을 입력해주세요.');
      return null;
    }
    setValidationError(null);
    return { bannerImageUrl, bannerTitle: title };
  };

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = getPayload();
    if (!payload) return;

    createLanding(payload, {
      onSuccess: () => {
        toast.success('랜딩이 등록되었습니다.');
        onReset();
      },
    });
  };

  const handleUpdate = () => {
    if (editingLandingId === undefined) return;
    const payload = getPayload();
    if (!payload) return;

    updateLanding(
      { landingId: editingLandingId, body: payload },
      { onSuccess: () => toast.success('랜딩이 수정되었습니다.') }
    );
  };

  return (
    <form className={styles.form} onSubmit={handleCreate}>
      <p className={ui.helperText}>랜딩은 이미지와 타이틀만 관리합니다.</p>

      <div className={ui.fieldGrid}>
        <label className={ui.field}>
          수정 대상 랜딩 ID
          <input
            className={ui.input}
            value={editingLandingId ?? ''}
            placeholder="목록에서 수정 선택 시 자동 입력"
            readOnly
          />
        </label>
        <div className={ui.fullSpan}>
          <ImageUploadField
            label="랜딩 이미지 업로드"
            uploadEndpoint={API_ENDPOINT.LANDING.IMAGE_UPLOAD_URL}
            value={bannerImageUrl}
            onChange={setBannerImageUrl}
          />
        </div>
        <label className={ui.field}>
          랜딩 타이틀
          <input
            className={ui.input}
            value={bannerTitle}
            onChange={(e) => setBannerTitle(e.target.value)}
          />
        </label>
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
          disabled={isSubmitting}
        >
          랜딩 등록
        </button>
        <button
          className={ui.button.secondary}
          type="button"
          onClick={handleUpdate}
          disabled={editingLandingId === undefined || isSubmitting}
        >
          랜딩 수정
        </button>
        <button className={ui.button.secondary} type="button" onClick={onReset}>
          폼 초기화
        </button>
      </div>
    </form>
  );
}

export default LandingForm;
