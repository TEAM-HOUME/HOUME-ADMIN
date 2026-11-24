import * as styles from './HomePage.css';

/** 로그인 직후 첫 화면. 도메인 화면이 옮겨지면 메뉴에서 이동한다 */
function HomePage() {
  return (
    <section>
      <h2 className={styles.title}>HOUME 백오피스</h2>
      <p className={styles.description}>
        왼쪽 메뉴에서 관리할 항목을 선택하세요.
      </p>
    </section>
  );
}

export default HomePage;
