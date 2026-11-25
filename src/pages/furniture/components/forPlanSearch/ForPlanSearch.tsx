import { useState, type FormEvent } from 'react';

import * as ui from '@styles/adminUi.css';

import { getApiErrorMessage } from '@utils/getApiErrorMessage';

import * as styles from './ForPlanSearch.css';
import {
  useForPlanProductsQuery,
  type ForPlanParams,
} from '../../apis/queries/useForPlanProductsQuery';
import {
  buildForPlanParams,
  createEmptyForPlanValues,
  type ForPlanValues,
} from '../../utils/furnitureForm';

interface ForPlanSearchProps {
  /** v1: 기본 조회 · v2: mall / 네이버페이 필터 추가 */
  version: ForPlanParams['version'];
}

/** [기획 의사결정용] 가구 제품 조회 (for-plan V1 · V2) */
function ForPlanSearch({ version }: ForPlanSearchProps) {
  const [values, setValues] = useState<ForPlanValues>(createEmptyForPlanValues);
  const [params, setParams] = useState<ForPlanParams | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { data, isFetching, error } = useForPlanProductsQuery(params);

  const update = (patch: Partial<ForPlanValues>) =>
    setValues((prev) => ({ ...prev, ...patch }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setParams(buildForPlanParams(version, values));
      setValidationError(null);
    } catch (validation) {
      setValidationError(
        validation instanceof Error
          ? validation.message
          : '입력값을 확인해주세요.'
      );
    }
  };

  const renderResult = () => {
    if (validationError) {
      return (
        <p className={ui.errorText} role="alert">
          {validationError}
        </p>
      );
    }
    if (!params) return null;
    if (isFetching) return <p className={ui.emptyText}>조회 중...</p>;
    if (error) {
      return (
        <p className={ui.errorText} role="alert">
          {getApiErrorMessage(error)}
        </p>
      );
    }
    const products = data?.products ?? [];
    if (products.length === 0) {
      return <p className={ui.emptyText}>검색 결과가 없습니다.</p>;
    }

    return (
      <>
        {/* 어드민 토큰으로 호출하면 userName은 null이다 */}
        {data?.userName && (
          <p className={ui.helperText}>요청 사용자: {data.userName}</p>
        )}
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>이미지 (기준 · 상품)</th>
              <th className={styles.th}>상품명</th>
              <th className={styles.th}>몰명</th>
              <th className={styles.th}>상품 ID</th>
              <th className={styles.th}>유사도</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={`${product.furnitureProductId ?? ''}-${index}`}>
                <td className={styles.td}>
                  <div className={styles.images}>
                    {product.baseFurnitureImageUrl && (
                      <img
                        className={styles.image}
                        src={product.baseFurnitureImageUrl}
                        alt="기준 가구"
                      />
                    )}
                    {product.furnitureProductImageUrl && (
                      <img
                        className={styles.image}
                        src={product.furnitureProductImageUrl}
                        alt="상품"
                      />
                    )}
                  </div>
                </td>
                <td className={styles.td}>
                  {product.furnitureProductSiteUrl ? (
                    <a
                      className={styles.link}
                      href={product.furnitureProductSiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {product.furnitureProductName || '상품 링크'}
                    </a>
                  ) : (
                    product.furnitureProductName
                  )}
                </td>
                <td className={styles.td}>
                  {product.furnitureProductMallName}
                </td>
                <td className={styles.td}>{product.furnitureProductId}</td>
                <td className={styles.td}>
                  {product.similarity !== undefined
                    ? Math.round(product.similarity * 100) / 100
                    : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  };

  return (
    <form className={ui.formStack} onSubmit={handleSubmit}>
      <div className={styles.fourColumns}>
        <label className={ui.field}>
          태그 ID
          <input
            className={ui.input}
            type="number"
            value={values.tagId}
            onChange={(e) => update({ tagId: e.target.value })}
            placeholder="예: 1"
          />
        </label>
        <label className={ui.field}>
          가구 ID
          <input
            className={ui.input}
            type="number"
            value={values.furnitureId}
            onChange={(e) => update({ furnitureId: e.target.value })}
            placeholder="예: 2"
          />
        </label>
        <label className={ui.field}>
          검색 키워드
          <input
            className={ui.input}
            value={values.searchKeyword}
            onChange={(e) => update({ searchKeyword: e.target.value })}
            placeholder="예: 원목 침대, 소파"
          />
        </label>
        <label className={ui.field}>
          pHash (0~100)
          <input
            className={ui.input}
            type="number"
            min={0}
            max={100}
            value={values.pHash}
            onChange={(e) => update({ pHash: e.target.value })}
          />
        </label>
        {version === 'v2' && (
          <>
            <label className={`${ui.field} ${ui.fullSpan}`}>
              허용 몰 목록 (콤마로 구분)
              <input
                className={ui.input}
                value={values.allowedMalls}
                onChange={(e) => update({ allowedMalls: e.target.value })}
                placeholder="예: 롯데ON,쿠팡,11번가"
              />
              <span className={ui.helperText}>
                비워두면 mall 필터를 적용하지 않습니다.
              </span>
            </label>
            <label className={styles.checkboxField}>
              <input
                type="checkbox"
                checked={values.applyNaverPay}
                onChange={(e) => update({ applyNaverPay: e.target.checked })}
              />
              네이버페이 상품만
            </label>
          </>
        )}
      </div>
      <div className={ui.buttonRow}>
        <button
          className={ui.button.primary}
          type="submit"
          disabled={isFetching}
        >
          {version === 'v1' ? '제품 조회' : 'V2 제품 조회'}
        </button>
      </div>
      {renderResult()}
    </form>
  );
}

export default ForPlanSearch;
