import { useRef, useState } from 'react';

import { useImageUploadMutation } from '@apis/mutations/useImageUploadMutation';

import * as ui from '@styles/adminUi.css';

import { getApiErrorMessage } from '@utils/getApiErrorMessage';

import * as styles from './ImageUploadField.css';

interface ImageUploadFieldProps {
  label: string;
  /** 도메인별 `image-upload-url` API 경로 */
  uploadEndpoint: string;
  /** 현재 연결된 이미지의 publicUrl. 없으면 빈 문자열 */
  value: string;
  onChange: (publicUrl: string) => void;
}

/**
 * 파일 선택 → "S3 업로드" → 미리보기.
 * 업로드가 끝나야 publicUrl이 폼 값으로 들어간다 (SSR 대시보드와 같은 흐름).
 */
function ImageUploadField({
  label,
  uploadEndpoint,
  value,
  onChange,
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const {
    mutate: upload,
    isPending,
    error,
    isSuccess,
    reset,
  } = useImageUploadMutation(uploadEndpoint);

  const handleUpload = () => {
    if (!selectedFile) return;
    upload(selectedFile, {
      onSuccess: (publicUrl) => {
        onChange(publicUrl);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
    });
  };

  const statusText = (() => {
    if (isPending) return '이미지를 업로드하는 중입니다...';
    if (isSuccess) return '업로드가 완료되었습니다.';
    if (value)
      return '연결된 이미지가 있습니다. 새 파일을 업로드하면 교체됩니다.';
    return '이미지를 선택하고 업로드하세요.';
  })();

  return (
    <div className={ui.field}>
      {label}
      <div className={styles.panel}>
        <div className={styles.actions}>
          <input
            ref={fileInputRef}
            className={styles.fileInput}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={(e) => {
              setSelectedFile(e.target.files?.[0] ?? null);
              reset();
            }}
          />
          <button
            className={ui.button.secondary}
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || isPending}
          >
            S3 업로드
          </button>
        </div>
        {error ? (
          <p className={ui.errorText} role="alert">
            {getApiErrorMessage(error, '이미지 업로드 중 오류가 발생했습니다.')}
          </p>
        ) : (
          <p className={ui.helperText}>{statusText}</p>
        )}
        {value && (
          <div className={styles.preview}>
            <img className={styles.previewImage} src={value} alt={label} />
            <a
              className={styles.previewLink}
              href={value}
              target="_blank"
              rel="noopener noreferrer"
            >
              {value}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageUploadField;
