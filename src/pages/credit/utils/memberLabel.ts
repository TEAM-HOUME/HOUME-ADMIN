import type { AdminMemberResponse } from '@apis/__generated__/data-contracts';

/** 닉네임#태그 (닉네임이 없으면 '(닉네임 없음)') — SSR 표기와 같다 */
export const formatMemberNickname = (member: AdminMemberResponse) =>
  member.nickname
    ? `${member.nickname} #${member.nicknameTag ?? ''}`
    : '(닉네임 없음)';

/** 선택된 회원 안내·확인창에 쓰는 한 줄 표기 */
export const formatMemberLabel = (member: AdminMemberResponse) =>
  `${formatMemberNickname(member)} · ${member.email ?? '-'} (ID ${member.memberId})`;
