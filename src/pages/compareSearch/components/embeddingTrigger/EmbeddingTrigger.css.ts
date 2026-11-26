import { style } from '@vanilla-extract/css';

import { colorVars } from '@styles/tokens/color.css';
import { fontVars } from '@styles/tokens/font.css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.2rem',
});

export const row = style({
  display: 'flex',
  alignItems: 'flex-end',
  gap: '1.2rem',
});

export const limitField = style({
  width: '16rem',
});

export const success = style({
  ...fontVars.font.body_m_13,
  color: colorVars.color.text.primary,
});

export const warning = style({
  ...fontVars.font.body_m_13,
  color: colorVars.color.text.secondary,
});
