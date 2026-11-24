import { style } from '@vanilla-extract/css';

import { colorVars } from '@styles/tokens/color.css';
import { fontVars } from '@styles/tokens/font.css';

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
  color: colorVars.color.text.tertiary,
});

export const td = style({
  borderBottom: `1px solid ${colorVars.color.border.secondary}`,
  padding: '1rem 1.2rem',
  verticalAlign: 'middle',
  wordBreak: 'break-all',
});

export const image = style({
  display: 'block',
  borderRadius: '0.6rem',
  width: '10rem',
  height: 'auto',
});
