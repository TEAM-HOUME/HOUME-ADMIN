import { useMutation, useQueryClient } from '@tanstack/react-query';

import { HTTPMethod, request } from '@apis/config/request';

import { API_ENDPOINT } from '@constants/apiEndpoints';
import { queryKeys } from '@constants/queryKey';

interface DeleteRawProductMappingParams {
  rawProductId: number;
  mappingId: number;
}

export const deleteRawProductMapping = ({
  rawProductId,
  mappingId,
}: DeleteRawProductMappingParams) =>
  request<string>({
    method: HTTPMethod.DELETE,
    url: API_ENDPOINT.RAW_PRODUCT.MAPPING(rawProductId, mappingId),
  });

export const useDeleteRawProductMappingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRawProductMapping,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.curationRawProduct.all,
      }),
  });
};
