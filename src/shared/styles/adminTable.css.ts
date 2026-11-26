import { style } from '@vanilla-extract/css';

import { colorVars } from '@styles/tokens/color.css';
import { fontVars } from '@styles/tokens/font.css';

/** 어드민 목록 표 공통 스타일 (가격비교 검색 결과 · 프리셋 목록) */

export const wrapper = style({
  overflowX: 'auto',
});

export const table = style({
  width: '100%',
  borderCollapse: 'collapse',
  ...fontVars.font.body_r_14,
  color: colorVars.color.text.primary,
});

export const th = style({
  borderBottom: `1px solid ${colorVars.color.border.primary}`,
  padding: '1rem 1.2rem',
  ...fontVars.font.body_m_13,
  textAlign: 'left',
  whiteSpace: 'nowrap',
  color: colorVars.color.text.tertiary,
});

export const td = style({
  borderBottom: `1px solid ${colorVars.color.border.secondary}`,
  padding: '1rem 1.2rem',
  verticalAlign: 'middle',
  wordBreak: 'break-all',
});

export const thumbnail = style({
  display: 'block',
  border: `1px solid ${colorVars.color.border.secondary}`,
  borderRadius: '0.6rem',
  objectFit: 'cover',
  width: '6rem',
  height: '6rem',
});
