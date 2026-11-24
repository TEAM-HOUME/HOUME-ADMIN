import { useState, type FormEvent } from 'react';

import type { AdminMemberResponse } from '@apis/__generated__/data-contracts';

import * as ui from '@styles/adminUi.css';

import { getApiErrorMessage } from '@utils/getApiErrorMessage';

import * as styles from './MemberSearch.css';
import { useMemberSearchQuery } from '../../apis/queries/useMemberSearchQuery';
import { formatMemberNickname } from '../../utils/memberLabel';

interface MemberSearchProps {
  selectedMemberId?: number;
  onSelect: (member: AdminMemberResponse) => void;
}

/** 1. 회원 검색 — 이메일 전체 또는 닉네임 일부로 찾고 표에서 고른다 */
function MemberSearch({ selectedMemberId, onSelect }: MemberSearchProps) {
  const [keyword, setKeyword] = useState('');
  const [submittedKeyword, setSubmittedKeyword] = useState('');
  const [isEmptyKeyword, setIsEmptyKeyword] = useState(false);
  const {
    data: members,
    isFetching,
    error,
  } = useMemberSearchQuery(submittedKeyword);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = keyword.trim();
    setIsEmptyKeyword(trimmed === '');
    setSubmittedKeyword(trimmed);
  };

  const renderResult = () => {
    if (isEmptyKeyword) {
      return <p className={ui.emptyText}>검색어를 입력해주세요.</p>;
    }
    if (!submittedKeyword) return null;
    if (isFetching && !members) {
      return <p className={ui.emptyText}>검색 중...</p>;
    }
    if (error) {
      return (
        <p className={ui.errorText} role="alert">
          {getApiErrorMessage(error)}
        </p>
      );
    }
    if (!members || members.length === 0) {
      return <p className={ui.emptyText}>일치하는 회원이 없습니다.</p>;
    }

    return (
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>회원 ID</th>
            <th className={styles.th}>닉네임</th>
            <th className={styles.th}>이메일</th>
            <th className={`${styles.th} ${styles.alignEnd}`}>현재 크레딧</th>
            <th className={styles.th} aria-label="선택" />
          </tr>
        </thead>
        <tbody>
          {members.map((member) => {
            const isSelected =
              member.memberId !== undefined &&
              member.memberId === selectedMemberId;
            return (
              <tr
                key={member.memberId}
                className={isSelected ? styles.selectedRow : undefined}
              >
                <td className={styles.td}>{member.memberId}</td>
                <td className={styles.td}>{formatMemberNickname(member)}</td>
                <td className={styles.td}>{member.email}</td>
                <td className={`${styles.td} ${styles.alignEnd}`}>
                  {member.creditBalance}
                </td>
                <td className={`${styles.td} ${styles.alignEnd}`}>
                  <button
                    className={ui.button.secondary}
                    type="button"
                    disabled={member.memberId === undefined || isSelected}
                    onClick={() => onSelect(member)}
                  >
                    {isSelected ? '선택됨' : '선택'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <>
      <form className={styles.searchForm} onSubmit={handleSubmit}>
        <label className={`${ui.field} ${styles.keywordField}`}>
          이메일 또는 닉네임
          <input
            className={ui.input}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="이메일 전체 또는 닉네임 일부"
            autoComplete="off"
          />
        </label>
        <button className={ui.button.secondary} type="submit">
          검색
        </button>
      </form>
      {renderResult()}
    </>
  );
}

export default MemberSearch;
