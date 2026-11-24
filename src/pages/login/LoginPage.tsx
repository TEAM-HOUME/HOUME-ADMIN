import { useState, type FormEvent } from 'react';

import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { ROUTES } from '@routes/paths';

import {
  getAdminAccessToken,
  saveAdminSession,
} from '@apis/config/adminSession';

import { getApiErrorMessage } from '@utils/getApiErrorMessage';

import { useAdminLoginMutation } from './apis/mutations/useAdminLoginMutation';
import * as styles from './LoginPage.css';

interface LoginLocationState {
  from?: string;
}

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: login, isPending, error } = useAdminLoginMutation();

  // 보호 라우트에서 튕겨 왔다면 로그인 후 그 화면으로 돌려보낸다
  const redirectPath =
    (location.state as LoginLocationState | null)?.from ?? ROUTES.HOME;

  if (getAdminAccessToken()) {
    return <Navigate to={redirectPath} replace />;
  }

  const canSubmit = adminId.trim() !== '' && password !== '' && !isPending;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    login(
      { email: adminId.trim(), password },
      {
        onSuccess: ({ accessToken, expiresIn }) => {
          saveAdminSession(accessToken, expiresIn);
          navigate(redirectPath, { replace: true });
        },
      }
    );
  };

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>HOUME Admin</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            아이디
            <input
              className={styles.input}
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              autoComplete="username"
              autoFocus
            />
          </label>
          <label className={styles.label}>
            비밀번호
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>
          {error && (
            <p className={styles.errorText} role="alert">
              {getApiErrorMessage(
                error,
                '로그인에 실패했습니다. 잠시 후 다시 시도해주세요.'
              )}
            </p>
          )}
          <button
            className={styles.submitButton}
            type="submit"
            disabled={!canSubmit}
          >
            {isPending ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default LoginPage;
