import { useState, type FormEvent } from 'react';

import * as ui from '@styles/adminUi.css';

import { getApiErrorMessage } from '@utils/getApiErrorMessage';

import { useFurniturePromptQuery } from '../../apis/queries/useFurniturePromptQuery';
import TagSelect from '../tagSelect/TagSelect';

/** 프롬프트 조회 — 가구 한글 이름 + 태그로 프롬프트를 확인한다 */
function FurniturePromptLookup() {
  const [furnitureNameKr, setFurnitureNameKr] = useState('');
  const [tagId, setTagId] = useState('');
  const [target, setTarget] = useState<{
    furnitureNameKr: string;
    tagId: number;
  } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { data: prompt, isFetching, error } = useFurniturePromptQuery(target);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = furnitureNameKr.trim();
    if (!name || tagId === '') {
      setValidationError('가구 이름(한글)과 태그를 입력해주세요.');
      return;
    }
    setValidationError(null);
    setTarget({ furnitureNameKr: name, tagId: Number(tagId) });
  };

  const renderResult = () => {
    if (validationError) {
      return (
        <p className={ui.errorText} role="alert">
          {validationError}
        </p>
      );
    }
    if (!target) return null;
    if (isFetching) return <p className={ui.emptyText}>조회 중...</p>;
    if (error) {
      return (
        <p className={ui.errorText} role="alert">
          {getApiErrorMessage(error)}
        </p>
      );
    }
    return <p className={ui.readonlyBox}>{prompt || '-'}</p>;
  };

  return (
    <form className={ui.formStack} onSubmit={handleSubmit}>
      <div className={ui.fieldGrid}>
        <label className={ui.field}>
          가구 이름 (한글)
          <input
            className={ui.input}
            value={furnitureNameKr}
            onChange={(e) => setFurnitureNameKr(e.target.value)}
          />
        </label>
        <TagSelect label="태그" value={tagId} onChange={setTagId} />
      </div>
      {renderResult()}
      <div className={ui.buttonRow}>
        <button className={ui.button.secondary} type="submit">
          프롬프트 조회
        </button>
      </div>
    </form>
  );
}

export default FurniturePromptLookup;
