import { useMutation, useQueryClient } from '@tanstack/react-query';

import type {
  AdminCurationRawProductCreateRequest,
  AdminCurationRawProductResponse,
} from '@apis/__generated__/data-contracts';
import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

export const postRawProduct = (body: AdminCurationRawProductCreateRequest) =>
  request<AdminCurationRawProductResponse>({
    method: HTTPMethod.POST,
    url: API_ENDPOINT.RAW_PRODUCT.LIST,
    body,
  });

export const useCreateRawProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postRawProduct,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.curationRawProduct.all,
      }),
  });
};
