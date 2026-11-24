import { useState } from 'react';

import type { AdminMemberResponse } from '@apis/__generated__/data-contracts';

import * as ui from '@styles/adminUi.css';

import CreditGrantForm from './components/creditGrantForm/CreditGrantForm';
import MemberSearch from './components/memberSearch/MemberSearch';

/** 회원 크레딧 추가 — SSR 대시보드 '회원 크레딧 추가' 탭 */
function CreditPage() {
  const [selectedMember, setSelectedMember] =
    useState<AdminMemberResponse | null>(null);

  return (
    <>
      <h2 className={ui.pageTitle}>회원 크레딧 추가</h2>

      <section className={ui.card}>
        <div className={ui.cardHeader}>1. 회원 검색</div>
        <div className={ui.cardBody}>
          <MemberSearch
            selectedMemberId={selectedMember?.memberId}
            onSelect={setSelectedMember}
          />
        </div>
      </section>

      <section className={ui.card}>
        <div className={ui.cardHeader}>2. 크레딧 지급</div>
        <div className={ui.cardBody}>
          {/* 회원을 바꾸면 이전 지급 결과·입력값이 남지 않도록 새로 만든다 */}
          <CreditGrantForm
            key={selectedMember?.memberId ?? 'none'}
            member={selectedMember}
          />
        </div>
      </section>
    </>
  );
}

export default CreditPage;
