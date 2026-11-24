import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { ADMIN_MENU } from '@routes/adminMenu';
import { ROUTES } from '@routes/paths';

import { clearAdminSession } from '@apis/config/adminSession';
import { queryClient } from '@apis/config/queryClient';

import * as styles from './AdminLayout.css';

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    clearAdminSession();
    await navigate(ROUTES.LOGIN, { replace: true });
    // 이동한 뒤에 비워야 현재 화면의 쿼리가 다시 요청하지 않는다
    queryClient.clear();
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <p className={styles.logo}>HOUME Admin</p>
        <nav className={styles.menuList}>
          {ADMIN_MENU.map(({ label, path }) =>
            path ? (
              <NavLink
                key={label}
                to={path}
                end={path === ROUTES.HOME}
                className={styles.menuItem}
              >
                {label}
              </NavLink>
            ) : (
              <span
                key={label}
                className={styles.menuItemDisabled}
                title="아직 옮기지 않은 화면이에요"
              >
                {label}
              </span>
            )
          )}
        </nav>
        <button
          className={styles.logoutButton}
          type="button"
          onClick={() => void handleLogout()}
        >
          로그아웃
        </button>
      </aside>
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
