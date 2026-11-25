import { style } from '@vanilla-extract/css';

import { colorVars } from '@styles/tokens/color.css';
import { fontVars } from '@styles/tokens/font.css';

export const fourColumns = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: '1.6rem',
});

export const checkboxField = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
  ...fontVars.font.body_m_14,
  cursor: 'pointer',
  color: colorVars.color.text.primary,
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
  color: colorVars.color.text.tertiary,
});

export const td = style({
  borderBottom: `1px solid ${colorVars.color.border.secondary}`,
  padding: '1rem 1.2rem',
  verticalAlign: 'middle',
});

export const images = style({
  display: 'flex',
  gap: '0.8rem',
});

export const image = style({
  display: 'block',
  borderRadius: '0.4rem',
  width: '9.6rem',
  height: 'auto',
});

export const link = style({
  textDecoration: 'underline',
  color: colorVars.color.text.brand,
});
