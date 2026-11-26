import { useState } from 'react';

import { isAxiosError } from 'axios';

import * as ui from '@styles/adminUi.css';

import { getApiErrorMessage } from '@utils/getApiErrorMessage';

import * as styles from './EmbeddingTrigger.css';
import { useTriggerCurationEmbeddingMutation } from '../../apis/mutations/useTriggerCurationEmbeddingMutation';

const DEFAULT_LIMIT = '100';
const MAX_LIMIT = 1000;

/** 자체 카탈로그 임베딩 배치 — 누락된 title · image 임베딩을 백그라운드로 만든다 */
function EmbeddingTrigger() {
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const { mutate, isPending, isSuccess, isError, data, error, reset } =
    useTriggerCurationEmbeddingMutation();

  const handleTrigger = () => {
    // SSR과 같이 숫자가 아니면 100으로 보낸다
    const parsedLimit = Number.parseInt(limit, 10) || Number(DEFAULT_LIMIT);
    reset();
    mutate(parsedLimit);
  };

  const renderResult = () => {
    if (isSuccess) {
      return (
        <p className={styles.success}>✓ {data ?? '백그라운드 실행 시작됨'}</p>
      );
    }
    if (isError) {
      if (isAxiosError(error) && error.response?.status === 409) {
        return (
          <p className={styles.warning}>
            ⚠ {getApiErrorMessage(error, '이미 실행 중')}
          </p>
        );
      }
      return (
        <p className={ui.errorText} role="alert">
          ✗ 오류: {getApiErrorMessage(error)}
        </p>
      );
    }
    return null;
  };

  return (
    <div className={styles.container}>
      <p className={ui.helperText}>
        임베딩이 누락된 자체 카탈로그 상품에 title·image 임베딩을 생성합니다.
        백그라운드로 실행되며 결과는 서버 로그에서 확인하세요.
      </p>
      <div className={styles.row}>
        <label className={`${ui.field} ${styles.limitField}`}>
          처리 수량
          <input
            className={ui.input}
            type="number"
            min={1}
            max={MAX_LIMIT}
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
          />
        </label>
        <button
          className={ui.button.primary}
          type="button"
          onClick={handleTrigger}
          disabled={isPending}
        >
          {isPending ? '요청 중...' : '임베딩 실행'}
        </button>
      </div>
      {renderResult()}
    </div>
  );
}

export default EmbeddingTrigger;
