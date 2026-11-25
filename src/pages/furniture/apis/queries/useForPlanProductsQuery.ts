import { useQuery } from '@tanstack/react-query';

import type { FurnitureProductsInfoResponseForPlan } from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

export interface ForPlanParams {
  version: 'v1' | 'v2';
  tagId: number;
  furnitureId: number;
  searchKeyword: string;
  /** 0~100 */
  pHash: number;
  /** V2 전용: 비우면 mall 필터 미적용. 반복 파라미터(allowedMalls=a&allowedMalls=b)로 보낸다 */
  allowedMalls?: string[];
  /** V2 전용 */
  applyNaverPay?: boolean;
}

export const getForPlanProducts = ({
  version,
  tagId,
  furnitureId,
  searchKeyword,
  pHash,
  allowedMalls,
  applyNaverPay,
}: ForPlanParams) =>
  request<FurnitureProductsInfoResponseForPlan>({
    method: HTTPMethod.GET,
    url:
      version === 'v1'
        ? API_ENDPOINT.FOR_PLAN.V1(tagId, furnitureId)
        : API_ENDPOINT.FOR_PLAN.V2(tagId, furnitureId),
    query:
      version === 'v1'
        ? { searchKeyword, pHash }
        : {
            searchKeyword,
            pHash,
            applyNaverPay: applyNaverPay ?? false,
            allowedMalls:
              allowedMalls && allowedMalls.length > 0
                ? allowedMalls
                : undefined,
          },
  });

/**
 * [기획 의사결정용] 가구 제품 조회. 조회 버튼으로 확정된 조건이 있을 때만 요청한다.
 * 외부 검색이 섞여 느리고 결과가 바뀔 수 있어 캐시를 오래 쓰지 않는다.
 */
export const useForPlanProductsQuery = (params: ForPlanParams | null) =>
  useQuery({
    queryKey: queryKeys.furniture.forPlan(params ?? {}),
    queryFn: () => {
      if (!params) throw new Error('조회 조건이 없습니다.');
      return getForPlanProducts(params);
    },
    enabled: params !== null,
    staleTime: 0,
  });
