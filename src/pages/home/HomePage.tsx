import * as styles from './HomePage.css';

/** 로그인 직후 첫 화면. 도메인 화면이 옮겨지면 메뉴에서 이동한다 */
function HomePage() {
  return (
    <section>
      <h2 className={styles.title}>Houme 백오피스</h2>
      <p className={styles.description}>자유롭게 구성해주세요.</p>
    </section>
  );
}

export default HomePage;
