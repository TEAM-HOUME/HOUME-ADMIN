import { useState, type FormEvent } from 'react';

import { toast } from 'sonner';

import * as ui from '@styles/adminUi.css';

import { getApiErrorMessage } from '@utils/getApiErrorMessage';

import { useKeywordCheckMutation } from './apis/mutations/useKeywordCheckMutation';
import * as styles from './KeywordCheckPage.css';

/** Gemini 검색어 검증 — develop SSR 대시보드 '검색어 검증' 탭 */
function KeywordCheckPage() {
  const [productName, setProductName] = useState('');
  const { mutate, isPending, isSuccess, isError, data, error, reset } =
    useKeywordCheckMutation();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = productName.trim();
    if (!trimmed) {
      toast.error('상품명을 입력하세요.');
      return;
    }
    reset();
    mutate({ productName: trimmed });
  };

  return (
    <>
      <h2 className={ui.pageTitle}>Gemini 검색어 검증</h2>
      <p className={ui.pageDescription}>
        한글 상품명을 입력하면 Gemini가 생성한 eBay 영문 키워드와 쿠팡 한글
        키워드를 확인합니다.
      </p>

      <section className={ui.card}>
        <div className={ui.cardHeader}>검색어 변환 테스트</div>
        <div className={`${ui.cardBody} ${ui.formStack}`}>
          <form className={styles.inputRow} onSubmit={handleSubmit}>
            <label className={`${ui.field} ${styles.nameField}`}>
              한글 상품명 *
              <input
                className={ui.input}
                type="text"
                placeholder="예: 플렌토 속 깊은 5단 서랍장 800"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </label>
            <button
              className={`${ui.button.primary} ${styles.submitButton}`}
              type="submit"
              disabled={isPending}
            >
              검색어 생성
            </button>
          </form>

          {isPending && (
            <p className={ui.helperText}>⏳ Gemini 번역 중 (약 5~10초)...</p>
          )}

          {isSuccess && (
            <div className={styles.resultGrid}>
              <label className={ui.field}>
                eBay 영문 키워드
                <input
                  className={ui.input}
                  type="text"
                  readOnly
                  value={data.english ?? ''}
                />
              </label>
              <label className={ui.field}>
                쿠팡 한글 키워드
                <input
                  className={ui.input}
                  type="text"
                  readOnly
                  value={data.korean ?? ''}
                />
              </label>
            </div>
          )}

          {isError && (
            <p className={ui.errorText} role="alert">
              {getApiErrorMessage(error, '오류가 발생했습니다.')}
            </p>
          )}
        </div>
      </section>
    </>
  );
}

export default KeywordCheckPage;
