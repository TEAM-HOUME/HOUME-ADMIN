import { useState, type FormEvent } from 'react';

import { toast } from 'sonner';

import type { AdminFloorPlanResponse } from '@apis/__generated__/data-contracts';

import * as ui from '@styles/adminUi.css';

import * as styles from './FloorPlanForm.css';
import { useCreateFloorPlanMutation } from '../../apis/mutations/useCreateFloorPlanMutation';
import { useUpdateFloorPlanMutation } from '../../apis/mutations/useUpdateFloorPlanMutation';
import {
  buildFloorPlanPayload,
  createEmptyFloorPlanForm,
  EQUILIBRIUM_OPTIONS,
  floorPlanToFormValues,
  FORM_OPTIONS,
  STRUCTURE_OPTIONS,
  type FloorPlanFormValues,
} from '../../utils/floorPlanForm';
import CheckboxGroup from '../checkboxGroup/CheckboxGroup';
import FloorPlanImageEditor from '../floorPlanImageEditor/FloorPlanImageEditor';

interface FloorPlanFormProps {
  /** 수정 중인 도면. null이면 등록 모드 */
  editingFloorPlan: AdminFloorPlanResponse | null;
  /** 폼 초기화 / 등록 완료 → 등록 모드로 돌아간다 */
  onReset: () => void;
}

/**
 * 도면 등록 / 수정 폼.
 * 부모가 key를 수정 대상 id로 주므로, 대상이 바뀌면 폼 state가 새로 만들어진다.
 */
function FloorPlanForm({ editingFloorPlan, onReset }: FloorPlanFormProps) {
  const [values, setValues] = useState<FloorPlanFormValues>(() =>
    editingFloorPlan
      ? floorPlanToFormValues(editingFloorPlan)
      : createEmptyFloorPlanForm()
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const { mutate: createFloorPlan, isPending: isCreating } =
    useCreateFloorPlanMutation();
  const { mutate: updateFloorPlan, isPending: isUpdating } =
    useUpdateFloorPlanMutation();

  const isSubmitting = isCreating || isUpdating;
  const editingFloorPlanId = editingFloorPlan?.id;

  const update = (patch: Partial<FloorPlanFormValues>) =>
    setValues((prev) => ({ ...prev, ...patch }));

  /** 검증에 실패하면 메시지를 보여주고 null */
  const getPayload = () => {
    try {
      const payload = buildFloorPlanPayload(values);
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

    createFloorPlan(payload, {
      onSuccess: () => {
        toast.success('도면이 등록되었습니다.');
        onReset();
      },
    });
  };

  const handleUpdate = () => {
    if (editingFloorPlanId === undefined) return;
    const payload = getPayload();
    if (!payload) return;

    updateFloorPlan(
      { floorPlanId: editingFloorPlanId, body: payload },
      { onSuccess: () => toast.success('도면이 수정되었습니다.') }
    );
  };

  return (
    <form className={styles.form} onSubmit={handleCreate}>
      <p className={ui.helperText}>
        도면의 다중 매핑 조건과 모든 view를 함께 관리합니다.
      </p>

      <div className={ui.fieldGrid}>
        <label className={ui.field}>
          수정 대상 도면 ID
          <input
            className={ui.input}
            value={editingFloorPlanId ?? ''}
            placeholder="목록에서 수정 선택 시 자동 입력"
            readOnly
          />
        </label>
        <label className={ui.field}>
          도면 이름
          <input
            className={ui.input}
            value={values.name}
            onChange={(e) => update({ name: e.target.value })}
            placeholder="예: 복층 오피스텔 A타입"
          />
        </label>
        <div className={ui.fullSpan}>
          <CheckboxGroup
            legend="주거형태"
            options={FORM_OPTIONS}
            value={values.forms}
            onChange={(forms) => update({ forms })}
          />
        </div>
        <div className={ui.fullSpan}>
          <CheckboxGroup
            legend="구조"
            options={STRUCTURE_OPTIONS}
            value={values.structures}
            onChange={(structures) => update({ structures })}
          />
        </div>
        <div className={ui.fullSpan}>
          <CheckboxGroup
            legend="평형"
            options={EQUILIBRIUM_OPTIONS}
            value={values.equilibriums}
            onChange={(equilibriums) => update({ equilibriums })}
          />
        </div>
        <label className={`${ui.field} ${ui.fullSpan}`}>
          도면 프롬프트
          <textarea
            className={ui.textarea}
            value={values.floorPlanPrompt}
            onChange={(e) => update({ floorPlanPrompt: e.target.value })}
          />
        </label>
        <div className={ui.fullSpan}>
          <FloorPlanImageEditor
            images={values.images}
            onChange={(images) => update({ images })}
          />
        </div>
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
          도면 등록
        </button>
        <button
          className={ui.button.secondary}
          type="button"
          onClick={handleUpdate}
          disabled={editingFloorPlanId === undefined || isSubmitting}
        >
          도면 수정
        </button>
        <button className={ui.button.secondary} type="button" onClick={onReset}>
          폼 초기화
        </button>
      </div>
    </form>
  );
}

export default FloorPlanForm;
