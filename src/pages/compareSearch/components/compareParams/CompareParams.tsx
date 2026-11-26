import * as ui from '@styles/adminUi.css';

import * as styles from './CompareParams.css';
import { COMPARE_CATEGORY_OPTIONS } from '../../constants/compareCategory';

export interface CompareParamsValue {
  imageUrl: string;
  priceKrw: string;
  /** '' = 전체 */
  category: string;
}

interface CompareParamsProps {
  value: CompareParamsValue;
  onChange: (value: CompareParamsValue) => void;
}

/** 공통 파라미터 — 텍스트 · 이미지 검색이 함께 쓴다 */
function CompareParams({ value, onChange }: CompareParamsProps) {
  const imageUrl = value.imageUrl.trim();

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <label className={ui.field}>
          이미지 URL
          <input
            className={ui.input}
            type="text"
            placeholder="https://cdn.houme.kr/..."
            value={value.imageUrl}
            onChange={(e) => onChange({ ...value, imageUrl: e.target.value })}
          />
        </label>
        <label className={ui.field}>
          가격 (원, KRW) *
          <input
            className={ui.input}
            type="number"
            placeholder="350000"
            value={value.priceKrw}
            onChange={(e) => onChange({ ...value, priceKrw: e.target.value })}
          />
        </label>
        <label className={ui.field}>
          카테고리 (선택)
          <select
            className={ui.input}
            value={value.category}
            onChange={(e) => onChange({ ...value, category: e.target.value })}
          >
            <option value="">전체</option>
            {COMPARE_CATEGORY_OPTIONS.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
      </div>
      {imageUrl && (
        <div className={styles.preview}>
          <span className={ui.helperText}>원본 상품</span>
          <img
            className={styles.previewImage}
            src={imageUrl}
            alt="원본 상품 이미지"
          />
        </div>
      )}
    </div>
  );
}

export default CompareParams;
