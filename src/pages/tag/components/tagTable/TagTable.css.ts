import { style } from '@vanilla-extract/css';

import { colorVars } from '@styles/tokens/color.css';
import { fontVars } from '@styles/tokens/font.css';

export const table = style({
  width: '100%',
  tableLayout: 'fixed',
  borderCollapse: 'collapse',
  ...fontVars.font.body_r_14,
  color: colorVars.color.text.primary,
});

export const th = style({
  borderBottom: `1px solid ${colorVars.color.border.primary}`,
  padding: '1rem 1.2rem',
  ...fontVars.font.body_m_13,
  textAlign: 'left',
  color: colorVars.color.text.tertiary,
});

export const td = style({
  borderBottom: `1px solid ${colorVars.color.border.secondary}`,
  padding: '1rem 1.2rem',
  overflowWrap: 'anywhere',
  verticalAlign: 'middle',
});

export const colId = style({ width: '6rem' });

export const colPriority = style({ width: '8rem' });

export const colName = style({ width: '18%' });

/** 수정 · 삭제 버튼 두 개가 한 줄에 들어가는 너비 */
export const colActions = style({ width: '15rem' });

export const selectedRow = style({
  backgroundColor: colorVars.color.fill.weak,
});

export const promptSummary = style({
  ...fontVars.font.body_m_13,
  cursor: 'pointer',
  color: colorVars.color.text.brand,
});

export const prompt = style({
  marginTop: '0.8rem',
  ...fontVars.font.body_r_13,
  whiteSpace: 'pre-wrap',
  color: colorVars.color.text.secondary,
});
