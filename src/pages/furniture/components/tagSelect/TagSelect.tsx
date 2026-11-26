import * as ui from '@styles/adminUi.css';

import { useFurnitureTagOptionsQuery } from '../../apis/queries/useFurnitureTagOptionsQuery';

interface TagSelectProps {
  label: string;
  /** 태그 ID 문자열. 고르기 전에는 '' */
  value: string;
  onChange: (tagId: string) => void;
}

/**
 * 스타일 태그 드롭다운 — 서버가 가구 화면용으로 주는 `/admin/furniture/tags`를 쓴다.
 * SSR에서 태그 ID를 직접 치던 칸(정보 수정 · 프롬프트 조회)도 이걸로 고른다.
 */
function TagSelect({ label, value, onChange }: TagSelectProps) {
  const { data: tags, isPending } = useFurnitureTagOptionsQuery();

  return (
    <label className={ui.field}>
      {label}
      <select
        className={ui.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isPending}
      >
        <option value="" disabled>
          {isPending ? '태그를 불러오는 중...' : '태그를 선택하세요...'}
        </option>
        {tags?.map((tag) => (
          <option key={tag.tagId} value={tag.tagId}>
            {tag.tagNameKr} (ID: {tag.tagId})
          </option>
        ))}
      </select>
    </label>
  );
}

export default TagSelect;
