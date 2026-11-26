import { useRef, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import * as ui from '@styles/adminUi.css';

import { getApiErrorMessage } from '@utils/getApiErrorMessage';

import { presetDetailQueryOptions } from './apis/queries/presetDetailQueryOptions';
import { usePresetListQuery } from './apis/queries/usePresetListQuery';
import PresetForm from './components/presetForm/PresetForm';
import PresetList from './components/presetList/PresetList';
import {
  EMPTY_PRESET_FORM,
  toPresetFormValues,
  type PresetFormValues,
} from './utils/presetForm';

interface FormState {
  editingId: number | null;
  initialValues: PresetFormValues;
  /** 바뀔 때마다 폼을 새로 그려 입력값 · 저장 결과를 비운다 */
  version: number;
}

/** 프리셋 관리 — develop SSR 대시보드 '프리셋 관리' 탭 */
function ComparePresetPage() {
  const queryClient = useQueryClient();
  const formRef = useRef<HTMLElement>(null);
  const [form, setForm] = useState<FormState>({
    editingId: null,
    initialValues: EMPTY_PRESET_FORM,
    version: 0,
  });
  const [loadingPresetId, setLoadingPresetId] = useState<number | null>(null);
  const {
    data: presets,
    isPending,
    error,
    refetch,
    isFetching,
  } = usePresetListQuery();

  const handleEdit = async (presetId: number) => {
    setLoadingPresetId(presetId);
    try {
      const detail = await queryClient.fetchQuery(
        presetDetailQueryOptions(presetId)
      );
      setForm((prev) => ({
        editingId: presetId,
        initialValues: toPresetFormValues(detail),
        version: prev.version + 1,
      }));
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (fetchError) {
      toast.error(
        getApiErrorMessage(fetchError, '프리셋 상세를 불러오지 못했습니다.')
      );
    } finally {
      setLoadingPresetId(null);
    }
  };

  const handleReset = () =>
    setForm((prev) => ({
      editingId: null,
      initialValues: EMPTY_PRESET_FORM,
      version: prev.version + 1,
    }));

  const renderList = () => {
    if (isPending) return <p className={ui.emptyText}>불러오는 중...</p>;
    if (error) {
      return (
        <p className={ui.errorText} role="alert">
          {getApiErrorMessage(error, '프리셋 목록을 불러오지 못했습니다.')}
        </p>
      );
    }
    return (
      <PresetList
        presets={presets}
        onEdit={(presetId) => void handleEdit(presetId)}
        loadingPresetId={loadingPresetId}
      />
    );
  };

  return (
    <>
      <h2 className={ui.pageTitle}>프리셋 관리</h2>
      <p className={ui.pageDescription}>
        가격비교 홈에 노출되는 예시 상품 프리셋을 등록·수정·삭제합니다.
      </p>

      <section className={ui.card}>
        <div className={ui.cardHeader}>
          등록된 프리셋
          <button
            className={ui.button.secondary}
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
          >
            새로고침
          </button>
        </div>
        <div className={ui.cardBody}>{renderList()}</div>
      </section>

      <section className={ui.card} ref={formRef}>
        <div className={ui.cardHeader}>
          {form.editingId === null
            ? '신규 프리셋 등록'
            : `프리셋 수정 (ID: ${form.editingId})`}
        </div>
        <div className={ui.cardBody}>
          <PresetForm
            key={form.version}
            editingId={form.editingId}
            initialValues={form.initialValues}
            onReset={handleReset}
          />
        </div>
      </section>
    </>
  );
}

export default ComparePresetPage;
