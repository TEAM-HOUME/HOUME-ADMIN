import { style } from '@vanilla-extract/css';

import { colorVars } from '@styles/tokens/color.css';
import { fontVars } from '@styles/tokens/font.css';

export const searchForm = style({
  display: 'flex',
  alignItems: 'flex-end',
  gap: '0.8rem',
  maxWidth: '64rem',
});

export const keywordField = style({
  flex: 1,
});

export const table = style({
  marginTop: '1.6rem',
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
  color: colorVars.color.text.tertiary,
});

export const td = style({
  borderBottom: `1px solid ${colorVars.color.border.secondary}`,
  padding: '1rem 1.2rem',
});

export const alignEnd = style({
  textAlign: 'right',
});

export const selectedRow = style({
  backgroundColor: colorVars.color.fill.weak,
});
