import { useState } from 'react';

import { toast } from 'sonner';

import * as ui from '@styles/adminUi.css';

import { getApiErrorMessage } from '@utils/getApiErrorMessage';

import { useImageSearchMutation } from './apis/mutations/useImageSearchMutation';
import { useTextSearchMutation } from './apis/mutations/useTextSearchMutation';
import * as styles from './CompareSearchPage.css';
import CompareParams, {
  type CompareParamsValue,
} from './components/compareParams/CompareParams';
import CompareResult from './components/compareResult/CompareResult';
import EmbeddingTrigger from './components/embeddingTrigger/EmbeddingTrigger';

const INITIAL_PARAMS: CompareParamsValue = {
  imageUrl: '',
  priceKrw: '',
  category: '',
};

/** SSR과 같은 가격 검사: 비어 있으면 / 0 이하이거나 숫자가 아니면 막는다 */
const parsePrice = (priceKrw: string): number | null => {
  if (!priceKrw) {
    toast.error('가격(KRW)을 입력해주세요.');
    return null;
  }
  const parsed = Number.parseFloat(priceKrw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    toast.error('가격은 0보다 큰 숫자여야 합니다.');
    return null;
  }
  return parsed;
};

/** 가격비교 검색 (의사결정용) — SSR 대시보드 '가격비교 검색' 탭 */
function CompareSearchPage() {
  const [params, setParams] = useState<CompareParamsValue>(INITIAL_PARAMS);
  const [title, setTitle] = useState('');
  const textSearch = useTextSearchMutation();
  const imageSearch = useImageSearchMutation();

  const category = params.category || undefined;

  const handleTextSearch = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      toast.error('한글 상품명을 입력해주세요.');
      return;
    }
    const priceKrw = parsePrice(params.priceKrw);
    if (priceKrw === null) return;

    textSearch.reset();
    textSearch.mutate({
      title: trimmedTitle,
      imageUrl: params.imageUrl.trim() || undefined,
      priceKrw,
      category,
    });
  };

  const handleImageSearch = () => {
    const imageUrl = params.imageUrl.trim();
    if (!imageUrl) {
      toast.error('이미지 URL을 입력해주세요.');
      return;
    }
    const priceKrw = parsePrice(params.priceKrw);
    if (priceKrw === null) return;

    imageSearch.reset();
    imageSearch.mutate({ imageUrl, priceKrw, category });
  };

  const renderResult = (
    search: typeof textSearch | typeof imageSearch,
    loadingText: string,
    showTextSimilarity: boolean
  ) => {
    if (search.isPending) return <p className={ui.helperText}>{loadingText}</p>;
    if (search.isError) {
      return (
        <p className={ui.errorText} role="alert">
          오류: {getApiErrorMessage(search.error)}
        </p>
      );
    }
    if (search.data) {
      return (
        <CompareResult
          result={search.data}
          showTextSimilarity={showTextSimilarity}
        />
      );
    }
    return null;
  };

  return (
    <>
      <h2 className={ui.pageTitle}>가격비교 검색 (의사결정용)</h2>
      <p className={styles.description}>
        텍스트 검색과 이미지 검색 각각의 결과를 비교해 파이프라인 로직을
        결정합니다.
      </p>

      <section className={ui.card}>
        <div className={ui.cardHeader}>자체 카탈로그 임베딩 배치</div>
        <div className={ui.cardBody}>
          <EmbeddingTrigger />
        </div>
      </section>

      <section className={ui.card}>
        <div className={ui.cardHeader}>공통 파라미터</div>
        <div className={ui.cardBody}>
          <CompareParams value={params} onChange={setParams} />
        </div>
      </section>

      <div className={styles.columns}>
        <section className={`${ui.card} ${styles.column}`}>
          <div className={ui.cardHeader}>📝 텍스트 검색</div>
          <div className={`${ui.cardBody} ${styles.columnBody}`}>
            <label className={ui.field}>
              한글 상품명 *
              <input
                className={ui.input}
                type="text"
                placeholder="원목 4인 식탁"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <div>
              <button
                className={ui.button.primary}
                type="button"
                onClick={handleTextSearch}
                disabled={textSearch.isPending}
              >
                텍스트 검색 실행
              </button>
            </div>
            {renderResult(
              textSearch,
              '⏳ 검색 중 (번역 + 임베딩, 약 20~30초)...',
              true
            )}
          </div>
        </section>

        <section className={`${ui.card} ${styles.column}`}>
          <div className={ui.cardHeader}>🖼️ 이미지 검색</div>
          <div className={`${ui.cardBody} ${styles.columnBody}`}>
            <p className={ui.helperText}>
              이미지 URL → base64 → eBay 이미지 검색. 위 공통 파라미터의 이미지
              URL을 사용합니다.
            </p>
            <div>
              <button
                className={ui.button.secondary}
                type="button"
                onClick={handleImageSearch}
                disabled={imageSearch.isPending}
              >
                이미지 검색 실행
              </button>
            </div>
            {renderResult(
              imageSearch,
              '⏳ 검색 중 (이미지 임베딩, 약 20~30초)...',
              false
            )}
          </div>
        </section>
      </div>
    </>
  );
}

export default CompareSearchPage;
