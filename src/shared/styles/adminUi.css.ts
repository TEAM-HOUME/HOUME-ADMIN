import { style, styleVariants } from '@vanilla-extract/css';

import { colorVars } from '@styles/tokens/color.css';
import { fontVars } from '@styles/tokens/font.css';

/**
 * 어드민 화면 공통 스타일.
 * 도메인 화면(배너·랜딩·스타일·도면 …)이 같은 카드·폼 모양을 쓰도록 한곳에 둔다.
 */

export const pageTitle = style({
  marginBottom: '2.4rem',
  ...fontVars.font.title_sb_24,
  color: colorVars.color.text.primary,
});

/** 페이지 제목 아래 한 줄 설명 */
export const pageDescription = style({
  marginTop: '-1.6rem',
  marginBottom: '2.4rem',
  ...fontVars.font.body_r_14,
  color: colorVars.color.text.tertiary,
});

export const card = style({
  marginBottom: '2.4rem',
  border: `1px solid ${colorVars.color.border.secondary}`,
  borderRadius: '1.2rem',
  backgroundColor: colorVars.color.bg.primary,
});

export const cardHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1.2rem',
  borderBottom: `1px solid ${colorVars.color.border.secondary}`,
  padding: '1.6rem 2rem',
  ...fontVars.font.title_sb_16,
  color: colorVars.color.text.primary,
});

export const cardBody = style({
  padding: '2rem',
});

/** 폼 안의 영역(입력칸 묶음 · 에러 · 버튼)을 세로로 띄운다 */
export const formStack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2.4rem',
});

export const sectionTitle = style({
  marginBottom: '1.2rem',
  ...fontVars.font.title_sb_15,
  color: colorVars.color.text.primary,
});

export const fieldGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '1.6rem',
});

export const fullSpan = style({
  gridColumn: '1 / -1',
});

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.6rem',
  ...fontVars.font.body_m_13,
  color: colorVars.color.text.secondary,
});

const controlBase = style({
  border: `1px solid ${colorVars.color.border.primary}`,
  borderRadius: '0.8rem',
  backgroundColor: colorVars.color.bg.primary,
  padding: '1rem 1.2rem',
  ...fontVars.font.body_r_14,
  width: '100%',
  color: colorVars.color.text.primary,
  ':focus': {
    borderColor: colorVars.color.border.strong,
  },
  ':read-only': {
    backgroundColor: colorVars.color.fill.weak,
  },
});

export const input = controlBase;

export const textarea = style([
  controlBase,
  {
    minHeight: '9.6rem',
    resize: 'vertical',
  },
]);

export const helperText = style({
  ...fontVars.font.caption_r_12,
  color: colorVars.color.text.tertiary,
});

export const errorText = style({
  ...fontVars.font.caption_r_12,
  color: colorVars.color.text.danger,
});

/** 읽기 전용 긴 텍스트(현재 프롬프트 등)를 보여주는 상자 */
export const readonlyBox = style({
  borderRadius: '0.8rem',
  backgroundColor: colorVars.color.fill.weak,
  ...fontVars.font.body_r_13,
  padding: '1.2rem',
  whiteSpace: 'pre-wrap',
  color: colorVars.color.text.secondary,
});

export const emptyText = style({
  padding: '1.2rem 0',
  ...fontVars.font.body_r_13,
  color: colorVars.color.text.tertiary,
});

export const buttonRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.8rem',
});

const buttonBase = style({
  flexShrink: 0,
  border: '1px solid transparent',
  borderRadius: '0.8rem',
  padding: '0.8rem 1.4rem',
  ...fontVars.font.body_m_13,
  whiteSpace: 'nowrap',
  ':disabled': {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
});

export const button = styleVariants({
  primary: [
    buttonBase,
    {
      color: colorVars.color.text.inverse,
      backgroundColor: colorVars.color.fill.primary,
    },
  ],
  secondary: [
    buttonBase,
    {
      borderColor: colorVars.color.border.primary,
      color: colorVars.color.text.primary,
      backgroundColor: colorVars.color.bg.primary,
    },
  ],
  danger: [
    buttonBase,
    {
      color: colorVars.color.text.inverse,
      backgroundColor: colorVars.color.fill.danger,
    },
  ],
});

export const tag = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.6rem',
  borderRadius: '10rem',
  backgroundColor: colorVars.color.fill.weak,
  ...fontVars.font.caption_m_12,
  padding: '0.4rem 1rem',
  color: colorVars.color.text.secondary,
});

export const tagRemoveButton = style({
  ...fontVars.font.body_m_14,
  color: colorVars.color.text.tertiary,
});
