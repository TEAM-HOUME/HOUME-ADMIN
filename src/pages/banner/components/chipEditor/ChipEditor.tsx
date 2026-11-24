import * as ui from '@styles/adminUi.css';

import * as styles from './ChipEditor.css';
import {
  BANNER_CHIP_MAX_COUNT,
  type BannerChipFormValue,
} from '../../utils/bannerForm';
import RawProductSearch from '../rawProductSearch/RawProductSearch';

interface ChipEditorProps {
  index: number;
  value: BannerChipFormValue;
  onChange: (next: BannerChipFormValue) => void;
}

/** 스타일 답변 칩 하나: 순서 · 칩 문구 · selected prompt · 연결 RAW 상품 */
function ChipEditor({ index, value, onChange }: ChipEditorProps) {
  const update = (patch: Partial<BannerChipFormValue>) =>
    onChange({ ...value, ...patch });

  return (
    <div className={styles.container}>
      <p className={styles.title}>답변 칩 {index + 1}</p>
      <div className={styles.row}>
        <label className={ui.field}>
          순서
          <input
            className={ui.input}
            type="number"
            min={1}
            max={BANNER_CHIP_MAX_COUNT}
            value={value.order}
            onChange={(e) => update({ order: e.target.value })}
          />
        </label>
        <label className={ui.field}>
          칩 문구
          <input
            className={ui.input}
            value={value.label}
            onChange={(e) => update({ label: e.target.value })}
            placeholder="예: 모니터 받침대가 결합된 책상"
          />
        </label>
        <label className={ui.field}>
          selected prompt
          <textarea
            className={ui.textarea}
            value={value.selectedPrompt}
            onChange={(e) => update({ selectedPrompt: e.target.value })}
            placeholder="선택된 답변 칩이 이미지 생성 프롬프트에 추가할 문구를 입력하세요."
          />
        </label>
      </div>
      <RawProductSearch
        label="연결 RAW 상품 검색"
        size={8}
        closeOnSelect
        selectedIds={value.rawProduct ? [value.rawProduct.id] : []}
        onSelect={(rawProduct) => update({ rawProduct })}
      />
      {value.rawProduct ? (
        <div>
          <span className={ui.tag}>
            {value.rawProduct.productName} (#{value.rawProduct.id})
            <button
              className={ui.tagRemoveButton}
              type="button"
              aria-label="선택 해제"
              onClick={() => update({ rawProduct: null })}
            >
              ×
            </button>
          </span>
        </div>
      ) : (
        <p className={ui.helperText}>선택된 RAW 상품이 없습니다.</p>
      )}
    </div>
  );
}

export default ChipEditor;
