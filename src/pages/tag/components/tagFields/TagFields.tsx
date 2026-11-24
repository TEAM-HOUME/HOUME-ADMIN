import * as ui from '@styles/adminUi.css';

import type { TagFormValues } from '../../utils/tagForm';

interface TagFieldsProps {
  values: TagFormValues;
  onChange: (next: TagFormValues) => void;
  /** 수정 폼은 '새 우선순위'처럼 라벨 앞에 붙인다 */
  labelPrefix?: string;
}

/** 태그 생성·수정 폼이 같이 쓰는 입력칸 4개 */
function TagFields({ values, onChange, labelPrefix = '' }: TagFieldsProps) {
  const update = (patch: Partial<TagFormValues>) =>
    onChange({ ...values, ...patch });

  return (
    <>
      <label className={ui.field}>
        {labelPrefix}우선순위
        <input
          className={ui.input}
          type="number"
          value={values.priority}
          onChange={(e) => update({ priority: e.target.value })}
        />
      </label>
      <label className={ui.field}>
        {labelPrefix}태그 이름 (영어)
        <input
          className={ui.input}
          value={values.tagName}
          onChange={(e) => update({ tagName: e.target.value })}
        />
      </label>
      <label className={ui.field}>
        {labelPrefix}태그 이름 (한글)
        <input
          className={ui.input}
          value={values.tagNameKr}
          onChange={(e) => update({ tagNameKr: e.target.value })}
        />
      </label>
      <label className={`${ui.field} ${ui.fullSpan}`}>
        {labelPrefix}태그 프롬프트
        <textarea
          className={ui.textarea}
          value={values.tagPrompt}
          onChange={(e) => update({ tagPrompt: e.target.value })}
        />
      </label>
    </>
  );
}

export default TagFields;
