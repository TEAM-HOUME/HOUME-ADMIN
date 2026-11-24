import { useRef, useState, type FormEvent } from 'react';

import { toast } from 'sonner';

import { useTagListQuery } from '@apis/queries/useTagListQuery';

import * as ui from '@styles/adminUi.css';

import { getApiErrorMessage } from '@utils/getApiErrorMessage';

import { useCreateMoodboardMutation } from '../../apis/mutations/useCreateMoodboardMutation';

/** 무드보드 이미지 업로드 — 파일 · 표시 이름 · 스타일 태그 */
function MoodboardUploadForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [originalFilename, setOriginalFilename] = useState('');
  const [tagId, setTagId] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const { data: tags, isPending: isTagsPending } = useTagListQuery();
  const {
    mutate: createMoodboard,
    isPending,
    error,
    reset,
  } = useCreateMoodboardMutation();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    reset();

    const name = originalFilename.trim();
    if (!file || !file.type.startsWith('image/')) {
      setValidationError('이미지 파일을 선택해주세요.');
      return;
    }
    if (!name || tagId === '') {
      setValidationError('원본 파일 이름과 스타일 태그를 입력해주세요.');
      return;
    }
    setValidationError(null);

    createMoodboard(
      { file, originalFilename: name, tagId: Number(tagId) },
      {
        onSuccess: () => {
          toast.success('무드보드 이미지 업로드에 성공했습니다.');
          setFile(null);
          setOriginalFilename('');
          if (fileInputRef.current) fileInputRef.current.value = '';
        },
      }
    );
  };

  return (
    <form className={ui.formStack} onSubmit={handleSubmit}>
      <div className={ui.fieldGrid}>
        <label className={ui.field}>
          이미지 파일 선택
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
        <label className={ui.field}>
          원본 파일 이름
          <input
            className={ui.input}
            value={originalFilename}
            onChange={(e) => setOriginalFilename(e.target.value)}
            placeholder="예: 미드센추리 블루 스타일"
          />
          <span className={ui.helperText}>
            사용자에게 보여질 파일 이름(한글)을 작성해주세요.
          </span>
        </label>
        <label className={ui.field}>
          스타일 태그
          <select
            className={ui.input}
            value={tagId}
            onChange={(e) => setTagId(e.target.value)}
            disabled={isTagsPending}
          >
            <option value="" disabled>
              {isTagsPending ? '태그를 불러오는 중...' : '태그를 선택하세요...'}
            </option>
            {tags?.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.tag_name_kr} (ID: {tag.id})
              </option>
            ))}
          </select>
        </label>
      </div>

      {(validationError ?? error) && (
        <p className={ui.errorText} role="alert">
          {validationError ??
            getApiErrorMessage(error, '업로드 중 오류가 발생했습니다.')}
        </p>
      )}

      <div className={ui.buttonRow}>
        <button
          className={ui.button.primary}
          type="submit"
          disabled={isPending}
        >
          {isPending ? '업로드 중...' : '업로드'}
        </button>
      </div>
    </form>
  );
}

export default MoodboardUploadForm;
