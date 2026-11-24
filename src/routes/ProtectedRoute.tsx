// 라우트 가드 컴포넌트
// 1) 저장된 토큰이 없거나 만료됐으면 바로 로그인 화면으로 보낸다
// 2) 토큰이 있으면 서버(/api/v1/admin/test)에서 어드민 토큰인지 한 번 확인한다
//    실패하면 axiosInstance가 토큰을 지우고 로그인 화면으로 보낸다
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { ROUTES } from '@routes/paths';

import { getAdminAccessToken } from '@apis/config/adminSession';
import { useAdminAuthCheckQuery } from '@apis/queries/useAdminAuthCheckQuery';

function AuthCheckedOutlet() {
  const { isPending, isError } = useAdminAuthCheckQuery();

  // 확인 중이거나 실패(→ 로그인으로 이동 중)일 때는 화면을 그리지 않는다
  if (isPending || isError) return null;
  return <Outlet />;
}

function ProtectedRoute() {
  const location = useLocation();

  if (!getAdminAccessToken()) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return <AuthCheckedOutlet />;
}

export default ProtectedRoute;
