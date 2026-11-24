import { useRef, useState } from 'react';

import { useImageUploadMutation } from '@apis/mutations/useImageUploadMutation';

import { API_ENDPOINT } from '@constants/apiEndpoints';

import * as ui from '@styles/adminUi.css';

import { getApiErrorMessage } from '@utils/getApiErrorMessage';
import { validateImageFile } from '@utils/validateImageFile';

import * as styles from './FloorPlanImageEditor.css';
import {
  extractFilenameFromUrl,
  type FloorPlanImageItem,
} from '../../utils/floorPlanForm';

interface FloorPlanImageEditorProps {
  images: FloorPlanImageItem[];
  onChange: (next: FloorPlanImageItem[]) => void;
}

/**
 * 도면 이미지 여러 장 관리.
 * 한 장씩 S3에 올려 목록에 추가하고, 장마다 view를 입력하고, 순서를 바꾸거나 뺀다.
 * 배열 순서가 곧 sortOrder이고, 첫 번째 이미지가 대표 이미지가 된다.
 */
function FloorPlanImageEditor({ images, onChange }: FloorPlanImageEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newImageView, setNewImageView] = useState('');
  const [lastUploadedName, setLastUploadedName] = useState<string | null>(null);
  const {
    mutate: upload,
    isPending,
    error,
    reset,
  } = useImageUploadMutation(API_ENDPOINT.FLOOR_PLAN.IMAGE_UPLOAD_URL);

  const handleUpload = () => {
    if (!selectedFile) return;
    const file = selectedFile;

    upload(file, {
      onSuccess: (publicUrl) => {
        // uploadImage 안에서 이미 통과한 검증이라 확장자를 그대로 쓸 수 있다
        const validation = validateImageFile(file);
        onChange([
          ...images,
          {
            url: publicUrl,
            filename: extractFilenameFromUrl(publicUrl),
            originalFilename: file.name,
            fileExtension: validation.ok ? validation.extension : '',
            view: newImageView.trim(),
          },
        ]);
        setLastUploadedName(file.name);
        setSelectedFile(null);
        setNewImageView('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
    });
  };

  const move = (from: number, to: number) => {
    const next = [...images];
    const [moved] = next.splice(from, 1);
    if (!moved) return;
    next.splice(to, 0, moved);
    onChange(next);
  };

  const remove = (index: number) =>
    onChange(images.filter((_, i) => i !== index));

  const updateView = (index: number, view: string) =>
    onChange(
      images.map((image, i) => (i === index ? { ...image, view } : image))
    );

  const statusText = (() => {
    if (isPending) return '도면 이미지를 업로드하는 중입니다...';
    if (lastUploadedName) {
      return `${lastUploadedName} 업로드가 완료되어 도면 이미지 목록에 추가되었습니다.`;
    }
    return '이미지를 하나씩 업로드하고, 필요하면 view도 함께 입력하세요.';
  })();

  return (
    <div className={ui.field}>
      도면 이미지 업로드
      <div className={styles.uploadPanel}>
        <div className={styles.uploadRow}>
          <input
            ref={fileInputRef}
            className={styles.fileInput}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={(e) => {
              setSelectedFile(e.target.files?.[0] ?? null);
              setLastUploadedName(null);
              reset();
            }}
          />
          <input
            className={ui.input}
            value={newImageView}
            onChange={(e) => setNewImageView(e.target.value)}
            placeholder="이미지 view 예: 거실 / 주방 / 침실"
          />
          <button
            className={ui.button.secondary}
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || isPending}
          >
            S3 업로드 후 목록 추가
          </button>
        </div>
        {error ? (
          <p className={ui.errorText} role="alert">
            {getApiErrorMessage(
              error,
              '도면 이미지 업로드 중 오류가 발생했습니다.'
            )}
          </p>
        ) : (
          <p className={ui.helperText}>{statusText}</p>
        )}
      </div>
      <h3 className={ui.sectionTitle}>도면 이미지 목록</h3>
      <p className={ui.helperText}>첫 번째 이미지가 대표 이미지로 쓰입니다.</p>
      {images.length === 0 ? (
        <p className={ui.emptyText}>아직 업로드된 도면 이미지가 없습니다.</p>
      ) : (
        <ol className={styles.imageList}>
          {images.map((image, index) => (
            <li key={image.url} className={styles.imageCard}>
              <img
                className={styles.image}
                src={image.url}
                alt={image.originalFilename || `도면 이미지 ${index + 1}`}
              />
              <div className={styles.imageInfo}>
                <span className={styles.imageTitle}>
                  도면 이미지 {index + 1}
                  {index === 0 && ' (대표)'}
                </span>
                <span className={styles.imageMeta}>
                  원본 파일명: {image.originalFilename || '-'}
                </span>
                <span className={styles.imageMeta}>
                  저장 파일명: {image.filename || '-'}
                </span>
                <span className={styles.imageMeta}>
                  확장자: {image.fileExtension || '-'} · 순서: {index + 1}
                </span>
                <label className={`${ui.field} ${styles.viewField}`}>
                  이미지 view
                  <input
                    className={ui.input}
                    value={image.view}
                    onChange={(e) => updateView(index, e.target.value)}
                    placeholder="예: 거실 / 주방 / 침실"
                  />
                </label>
              </div>
              <div className={styles.imageActions}>
                <button
                  className={ui.button.secondary}
                  type="button"
                  disabled={index === 0}
                  onClick={() => move(index, index - 1)}
                >
                  위로
                </button>
                <button
                  className={ui.button.secondary}
                  type="button"
                  disabled={index === images.length - 1}
                  onClick={() => move(index, index + 1)}
                >
                  아래로
                </button>
                <button
                  className={ui.button.danger}
                  type="button"
                  onClick={() => remove(index)}
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default FloorPlanImageEditor;
