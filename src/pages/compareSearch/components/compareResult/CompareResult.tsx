import type {
  AdminSearchResult,
  FilterStats,
} from '@apis/__generated__/data-contracts';

import * as table from '@styles/adminTable.css';
import * as ui from '@styles/adminUi.css';

import * as styles from './CompareResult.css';

interface CompareResultProps {
  result: AdminSearchResult;
  /** 텍스트 검색이면 텍스트 유사도 열을 보여준다 */
  showTextSimilarity: boolean;
}

const formatPercent = (value?: number) =>
  value === undefined ? '-' : `${(value * 100).toFixed(1)}%`;

const formatUsd = (value?: number) =>
  value === undefined ? '-' : `$${value.toFixed(2)}`;

const FILTER_STEPS: { label: string; key: keyof FilterStats }[] = [
  { label: 'eBay 수집', key: 'totalFetched' },
  { label: '카테고리 필터 후', key: 'afterCategoryFilter' },
  { label: '가격 필터 후', key: 'afterPriceFilter' },
  { label: '스코어링', key: 'scored' },
];

/** 검색 결과 — 필터 단계별 개수와 상위 후보 표 */
function CompareResult({ result, showTextSimilarity }: CompareResultProps) {
  const { items = [], filterStats } = result;

  return (
    <div className={styles.container}>
      {filterStats && (
        <div className={styles.stats}>
          {FILTER_STEPS.map((step, index) => (
            <span key={step.key} className={styles.statsStep}>
              {index > 0 && <span className={styles.arrow}>→</span>}
              <span className={ui.tag}>
                {step.label}: {filterStats[step.key] ?? '-'}
              </span>
            </span>
          ))}
        </div>
      )}

      {items.length === 0 ? (
        <p className={styles.empty}>결과 없음</p>
      ) : (
        <div className={table.wrapper}>
          <table className={table.table}>
            <thead>
              <tr>
                <th className={table.th}>#</th>
                <th className={table.th}>이미지</th>
                <th className={table.th}>상품명</th>
                <th className={table.th}>가격(USD)</th>
                {showTextSimilarity && (
                  <th className={table.th}>텍스트유사도</th>
                )}
                <th className={table.th}>이미지유사도</th>
                <th className={table.th}>종합점수</th>
                <th className={table.th}>링크</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.productUrl ?? index}>
                  <td className={table.td}>{index + 1}</td>
                  <td className={table.td}>
                    {item.imageUrl ? (
                      <img
                        className={table.thumbnail}
                        src={item.imageUrl}
                        alt=""
                      />
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className={`${table.td} ${styles.title}`}>
                    {item.title}
                  </td>
                  <td className={table.td}>{formatUsd(item.priceUsd)}</td>
                  {showTextSimilarity && (
                    <td className={table.td}>
                      {formatPercent(item.textSimilarity)}
                    </td>
                  )}
                  <td className={table.td}>
                    {formatPercent(item.imageSimilarity)}
                  </td>
                  <td className={table.td}>
                    <strong>{formatPercent(item.combinedScore)}</strong>
                  </td>
                  <td className={table.td}>
                    {item.productUrl ? (
                      <a
                        className={ui.button.secondary}
                        href={item.productUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        eBay
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CompareResult;
