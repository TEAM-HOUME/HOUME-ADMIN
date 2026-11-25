import { useRouteError } from 'react-router-dom';

import * as ui from '@styles/adminUi.css';

import { getApiErrorMessage } from '@utils/getApiErrorMessage';

/**
 * 화면을 그리다 예상하지 못한 에러가 났을 때 보여준다.
 * 없으면 화면 전체가 하얗게 비어 무슨 일인지 알 수 없다.
 */
function RouteErrorFallback() {
  const error = useRouteError();

  return (
    <section className={ui.card}>
      <div className={ui.cardHeader}>화면을 표시하는 중 오류가 발생했어요</div>
      <div className={`${ui.cardBody} ${ui.formStack}`}>
        <p className={ui.readonlyBox}>
          {getApiErrorMessage(error, '알 수 없는 오류가 발생했습니다.')}
        </p>
        <p className={ui.helperText}>
          문제가 계속되면 이 메시지와 함께 어떤 동작을 했는지 알려주세요.
        </p>
        <div className={ui.buttonRow}>
          <button
            className={ui.button.primary}
            type="button"
            onClick={() => window.location.reload()}
          >
            다시 시도
          </button>
        </div>
      </div>
    </section>
  );
}

export default RouteErrorFallback;
