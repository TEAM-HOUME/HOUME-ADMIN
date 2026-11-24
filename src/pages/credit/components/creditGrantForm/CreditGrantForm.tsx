import { useState, type FormEvent } from 'react';

import type { AdminMemberResponse } from '@apis/__generated__/data-contracts';

import * as ui from '@styles/adminUi.css';

import * as styles from './CreditGrantForm.css';
import { useGrantCreditMutation } from '../../apis/mutations/useGrantCreditMutation';
import { formatMemberLabel } from '../../utils/memberLabel';

/** 서버 기준 1회 지급 범위 (`@Positive @Max(1000)`) */
const MIN_AMOUNT = 1;
const MAX_AMOUNT = 1000;
const DEFAULT_AMOUNT = '5';

interface CreditGrantFormProps {
  member: AdminMemberResponse | null;
}

/** 2. 크레딧 지급 — 고른 회원에게 개수를 지정해 지급한다 */
function CreditGrantForm({ member }: CreditGrantFormProps) {
  const [amount, setAmount] = useState(DEFAULT_AMOUNT);
  const [validationError, setValidationError] = useState<string | null>(null);
  const {
    mutate: grantCredit,
    isPending,
    data: grantResult,
    reset,
  } = useGrantCreditMutation();

  const memberId = member?.memberId;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!member || memberId === undefined) {
      setValidationError('먼저 회원을 선택해주세요.');
      return;
    }

    const parsedAmount = Number(amount);
    if (
      !Number.isInteger(parsedAmount) ||
      parsedAmount < MIN_AMOUNT ||
      parsedAmount > MAX_AMOUNT
    ) {
      setValidationError(
        `${MIN_AMOUNT}~${MAX_AMOUNT} 사이의 크레딧 개수를 입력해주세요.`
      );
      return;
    }
    setValidationError(null);

    // 실제 회원에게 지급되므로 대상과 개수를 한 번 더 확인한다 (SSR에는 없던 단계)
    const confirmed = window.confirm(
      `${formatMemberLabel(member)}에게 크레딧 ${parsedAmount}개를 지급할까요?`
    );
    if (!confirmed) return;

    grantCredit({ memberId, body: { amount: parsedAmount } });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <p className={member ? styles.selectedMember : ui.helperText}>
        {member
          ? `선택된 회원: ${formatMemberLabel(member)}`
          : '위 목록에서 회원을 선택하세요.'}
      </p>
      <label className={`${ui.field} ${styles.amountField}`}>
        추가할 크레딧 개수
        <input
          className={ui.input}
          type="number"
          min={MIN_AMOUNT}
          max={MAX_AMOUNT}
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            reset();
          }}
        />
      </label>

      {validationError && (
        <p className={ui.errorText} role="alert">
          {validationError}
        </p>
      )}
      {grantResult && (
        <p className={styles.successText} role="status">
          크레딧 {grantResult.grantedAmount}개 지급 완료 · 현재 보유{' '}
          {grantResult.creditBalance}개
        </p>
      )}

      <div className={ui.buttonRow}>
        <button
          className={ui.button.primary}
          type="submit"
          disabled={!member || isPending}
        >
          {isPending ? '지급 중...' : '크레딧 지급'}
        </button>
      </div>
    </form>
  );
}

export default CreditGrantForm;
