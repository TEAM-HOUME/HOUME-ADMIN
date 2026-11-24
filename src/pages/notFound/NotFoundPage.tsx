import { Link } from 'react-router-dom';

import { ROUTES } from '@routes/paths';

import * as styles from './NotFoundPage.css';

function NotFoundPage() {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>페이지를 찾을 수 없어요</h1>
      <Link className={styles.link} to={ROUTES.HOME}>
        홈으로
      </Link>
    </main>
  );
}

export default NotFoundPage;
