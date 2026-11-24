import { ROUTES } from '@routes/paths';

// 여러 요청이 동시에 401/403을 받아도 이동은 한 번만 한다
let isRedirecting = false;

/**
 * 로그인 화면으로 보낸 뒤 캐시를 비운다.
 * 이전 세션의 데이터가 다음 로그인 직후 화면에 보이지 않게 한다.
 * router·queryClient가 이 파일을 간접적으로 import하므로 순환 참조를 피하려고 dynamic import한다.
 */
export const redirectToLogin = async (): Promise<void> => {
  if (isRedirecting) return;
  isRedirecting = true;

  try {
    const { router } = await import('@routes/router');
    if (router.state.location.pathname !== ROUTES.LOGIN) {
      await router.navigate(ROUTES.LOGIN, { replace: true });
    }
    const { queryClient } = await import('@apis/config/queryClient');
    queryClient.clear();
  } finally {
    isRedirecting = false;
  }
};
