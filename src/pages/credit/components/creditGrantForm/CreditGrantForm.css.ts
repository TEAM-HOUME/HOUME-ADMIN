import { style } from '@vanilla-extract/css';

import { colorVars } from '@styles/tokens/color.css';
import { fontVars } from '@styles/tokens/font.css';

export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.6rem',
});

export const selectedMember = style({
  ...fontVars.font.body_m_14,
  color: colorVars.color.text.primary,
});

export const amountField = style({
  maxWidth: '22rem',
});

export const successText = style({
  ...fontVars.font.body_m_13,
  color: colorVars.color.text.brand,
});
