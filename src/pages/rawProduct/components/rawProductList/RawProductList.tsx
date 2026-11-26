import { useState, type FormEvent } from 'react';

import { toast } from 'sonner';

import * as ui from '@styles/adminUi.css';

import { getApiErrorMessage } from '@utils/getApiErrorMessage';

import * as styles from './RawProductList.css';
import { useDeleteRawProductMutation } from '../../apis/mutations/useDeleteRawProductMutation';
import { useUpdateRawProductExposureMutation } from '../../apis/mutations/useUpdateRawProductExposureMutation';
import {
  useRawProductListQuery,
  type RawProductListParams,
} from '../../apis/queries/useRawProductListQuery';
import { getVisiblePages } from '../../utils/pagination';
import {
  buildRawProductFilter,
  CATEGORY_OPTIONS,
  createEmptyFilterValues,
  type RawProductFilterValues,
} from '../../utils/rawProductForm';
import RawProductCard from '../rawProductCard/RawProductCard';

const PAGE_SIZE = 20;

interface RawProductListProps {
  selectedProductId: number | null;
  onDetail: (rawProductId: number) => void;
  onDeleted: (rawProductId: number) => void;
}

/** RAW 상품 검색 및 목록 — 필터 · 카드 · 일괄 노출 변경 · 페이지네이션 */
function RawProductList({
  selectedProductId,
  onDetail,
  onDeleted,
}: RawProductListProps) {
  const [filterInputs, setFilterInputs] = useState<RawProductFilterValues>(
    createEmptyFilterValues
  );
  const [params, setParams] = useState<RawProductListParams>({
    page: 0,
    size: PAGE_SIZE,
  });
  const [filterError, setFilterError] = useState<string | null>(null);
  // 페이지를 넘겨도 체크는 유지된다 (SSR과 같음)
  const [checkedIds, setCheckedIds] = useState<Set<number>>(() => new Set());
  const [bulkExposure, setBulkExposure] = useState('true');

  const { data, isPending, isFetching, error, refetch } =
    useRawProductListQuery(params);
  const { mutate: updateExposure, isPending: isUpdatingExposure } =
    useUpdateRawProductExposureMutation();
  const { mutate: deleteRawProduct, isPending: isDeleting } =
    useDeleteRawProductMutation();

  const products = data?.products ?? [];
  const productIds = products.flatMap((product) =>
    product.id === undefined ? [] : [product.id]
  );
  const isAllChecked =
    productIds.length > 0 && productIds.every((id) => checkedIds.has(id));

  const setChecked = (ids: number[], checked: boolean) =>
    setCheckedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => (checked ? next.add(id) : next.delete(id)));
      return next;
    });

  const applyFilter = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    try {
      setParams({
        page: 0,
        size: PAGE_SIZE,
        ...buildRawProductFilter(filterInputs),
      });
      setFilterError(null);
    } catch (validation) {
      setFilterError(
        validation instanceof Error
          ? validation.message
          : '필터를 확인해주세요.'
      );
    }
  };

  const resetFilter = () => {
    setFilterInputs(createEmptyFilterValues());
    setFilterError(null);
    setParams({ page: 0, size: PAGE_SIZE });
  };

  const handleBulkExposure = () => {
    const rawProductIds = Array.from(checkedIds);
    if (rawProductIds.length === 0) {
      toast.error('노출 여부를 변경할 RAW 상품을 하나 이상 선택해주세요.');
      return;
    }
    const isExposed = bulkExposure === 'true';
    updateExposure(
      { rawProductIds, isExposed },
      {
        onSuccess: () => {
          toast.success(
            `${rawProductIds.length}개 상품을 ${isExposed ? '노출' : '숨김'}으로 변경했습니다.`
          );
          setCheckedIds(new Set());
        },
      }
    );
  };

  const handleDelete = (rawProductId: number) => {
    if (
      !window.confirm(`RAW 상품 ID ${rawProductId}를 정말로 삭제하시겠습니까?`)
    ) {
      return;
    }
    deleteRawProduct(rawProductId, {
      onSuccess: () => {
        toast.success('RAW 상품이 삭제되었습니다.');
        setChecked([rawProductId], false);
        onDeleted(rawProductId);
      },
    });
  };

  const renderBody = () => {
    if (isPending) return <p className={ui.emptyText}>불러오는 중...</p>;
    if (error) {
      return (
        <p className={ui.errorText} role="alert">
          {getApiErrorMessage(error, 'RAW 상품 목록을 불러오지 못했습니다.')}
        </p>
      );
    }
    if (products.length === 0) {
      return <p className={ui.emptyText}>등록된 RAW 상품이 없습니다.</p>;
    }

    const page = data?.page ?? params.page;
    const totalPages = data?.totalPages ?? 0;

    return (
      <>
        <div className={styles.grid}>
          {products.map((product) => {
            const id = product.id;
            if (id === undefined) return null;
            return (
              <RawProductCard
                key={id}
                product={product}
                isChecked={checkedIds.has(id)}
                isSelected={id === selectedProductId}
                onCheck={(checked) => setChecked([id], checked)}
                onDetail={() => onDetail(id)}
                onDelete={() => handleDelete(id)}
                isDeleting={isDeleting}
              />
            );
          })}
        </div>
        <div className={styles.pagination}>
          <span className={styles.pageMeta}>
            page={page + 1}/{Math.max(totalPages, 1)} · size=
            {data?.size ?? PAGE_SIZE} · total=
            {data?.totalElements ?? products.length}
          </span>
          <div className={styles.pages}>
            {getVisiblePages(page, totalPages).map((item, index) =>
              item === 'ellipsis' ? (
                <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                  …
                </span>
              ) : (
                <button
                  key={item}
                  className={`${ui.button.secondary} ${item === page ? styles.pageButtonActive : ''}`}
                  type="button"
                  disabled={item === page || isFetching}
                  onClick={() => setParams((prev) => ({ ...prev, page: item }))}
                >
                  {item + 1}
                </button>
              )
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className={ui.formStack}>
      <form className={styles.filters} onSubmit={applyFilter}>
        <label className={ui.field}>
          카테고리
          <select
            className={ui.input}
            value={filterInputs.category}
            onChange={(e) =>
              setFilterInputs({ ...filterInputs, category: e.target.value })
            }
          >
            <option value="">전체 카테고리</option>
            {CATEGORY_OPTIONS.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className={ui.field}>
          최소 가격
          <input
            className={ui.input}
            type="number"
            min={0}
            value={filterInputs.minListPrice}
            onChange={(e) =>
              setFilterInputs({ ...filterInputs, minListPrice: e.target.value })
            }
            placeholder="0"
          />
        </label>
        <label className={ui.field}>
          최대 가격
          <input
            className={ui.input}
            type="number"
            min={0}
            value={filterInputs.maxListPrice}
            onChange={(e) =>
              setFilterInputs({ ...filterInputs, maxListPrice: e.target.value })
            }
            placeholder="무제한"
          />
        </label>
        <div className={ui.buttonRow}>
          <button className={ui.button.primary} type="submit">
            조회
          </button>
          <button
            className={ui.button.secondary}
            type="button"
            onClick={resetFilter}
          >
            초기화
          </button>
        </div>
      </form>
      {filterError && (
        <p className={ui.errorText} role="alert">
          {filterError}
        </p>
      )}

      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={isAllChecked}
              onChange={(e) => setChecked(productIds, e.target.checked)}
              disabled={productIds.length === 0}
            />
            이 페이지 전체 선택
          </label>
          <span className={ui.helperText}>선택 {checkedIds.size}개</span>
          <select
            className={`${ui.input} ${styles.smallSelect}`}
            value={bulkExposure}
            onChange={(e) => setBulkExposure(e.target.value)}
          >
            <option value="true">선택 상품 노출</option>
            <option value="false">선택 상품 숨김</option>
          </select>
          <button
            className={ui.button.primary}
            type="button"
            onClick={handleBulkExposure}
            disabled={isUpdatingExposure}
          >
            일괄 적용
          </button>
        </div>
        <button
          className={ui.button.secondary}
          type="button"
          onClick={() => void refetch()}
          disabled={isFetching}
        >
          새로고침
        </button>
      </div>

      {renderBody()}
    </div>
  );
}

export default RawProductList;
