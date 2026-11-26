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

export const amountRow = style({
  display: 'flex',
  alignItems: 'flex-end',
  gap: '1.2rem',
});

export const amountField = style({
  width: '22rem',
});

/** 입력칸 높이에 맞춘다 */
export const submitButton = style({
  padding: '1.1rem 1.6rem',
});

export const successText = style({
  ...fontVars.font.body_m_13,
  color: colorVars.color.text.brand,
});
