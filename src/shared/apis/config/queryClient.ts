import { MutationCache, QueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

import { getApiErrorMessage } from '@utils/getApiErrorMessage';

/** 4xx는 다시 보내도 결과가 같으므로 재시도하지 않는다 */
const isClientError = (error: unknown) => {
  if (!isAxiosError(error)) return false;
  const status = error.response?.status;
  return status !== undefined && status >= 400 && status < 500;
};

export const queryClient = new QueryClient({
  // mutation 실패는 기본으로 토스트를 띄운다. 화면에서 직접 처리할 때는 meta.skipGlobalErrorToast
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.meta?.['skipGlobalErrorToast']) return;
      toast.error(getApiErrorMessage(error));
    },
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => !isClientError(error) && failureCount < 1,
      staleTime: 1000 * 60,
    },
    mutations: {
      retry: false,
    },
  },
});
