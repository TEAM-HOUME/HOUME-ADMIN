import { style } from '@vanilla-extract/css';

import { colorVars } from '@styles/tokens/color.css';
import { fontVars } from '@styles/tokens/font.css';

export const searchRow = style({
  display: 'flex',
  gap: '0.8rem',
});

export const resultList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.6rem',
  marginTop: '0.8rem',
  maxHeight: '28rem',
  overflowY: 'auto',
});

export const resultItem = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1.2rem',
  border: `1px solid ${colorVars.color.border.secondary}`,
  borderRadius: '0.8rem',
  padding: '1rem 1.2rem',
});

export const productName = style({
  ...fontVars.font.body_m_14,
  color: colorVars.color.text.primary,
});

export const productMeta = style({
  marginTop: '0.2rem',
  ...fontVars.font.caption_r_12,
  color: colorVars.color.text.tertiary,
});
