import { useTagListQuery } from '@apis/queries/useTagListQuery';

import * as ui from '@styles/adminUi.css';

interface TagSelectProps {
  label: string;
  /** 태그 ID 문자열. 고르기 전에는 '' */
  value: string;
  onChange: (tagId: string) => void;
}

/** 스타일 태그 드롭다운 (우선순위 순). SSR에서 태그 ID를 직접 치던 칸도 이걸로 고른다 */
function TagSelect({ label, value, onChange }: TagSelectProps) {
  const { data: tags, isPending } = useTagListQuery();

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
          <option key={tag.id} value={tag.id}>
            {tag.tag_name_kr} (ID: {tag.id})
          </option>
        ))}
      </select>
    </label>
  );
}

export default TagSelect;
