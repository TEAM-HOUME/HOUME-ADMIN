import { useState } from 'react';

import * as ui from '@styles/adminUi.css';

import * as shared from '../../rawProduct.css';

/** 이 개수를 넘으면 접어서 보여준다 (SSR buildRawChipSection) */
const COLLAPSE_THRESHOLD = 12;

interface ChipListProps {
  labels: string[];
  emptyText: string;
}

/** 읽기 전용 칩 목록 — 색상 · 매핑 요약에 쓴다 */
function ChipList({ labels, emptyText }: ChipListProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (labels.length === 0) {
    return <span className={ui.helperText}>{emptyText}</span>;
  }

  const isCollapsible = labels.length > COLLAPSE_THRESHOLD;
  const visible =
    isCollapsible && !isExpanded ? labels.slice(0, COLLAPSE_THRESHOLD) : labels;

  return (
    <div className={shared.tagList}>
      {visible.map((label, index) => (
        <span key={`${label}-${index}`} className={ui.tag}>
          {label}
        </span>
      ))}
      {isCollapsible && (
        <button
          className={ui.tagRemoveButton}
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          {isExpanded
            ? '접기'
            : `+${labels.length - COLLAPSE_THRESHOLD} 더보기`}
        </button>
      )}
    </div>
  );
}

export default ChipList;
