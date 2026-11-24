import { style } from '@vanilla-extract/css';

import { colorVars } from '@styles/tokens/color.css';
import { fontVars } from '@styles/tokens/font.css';

export const container = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colorVars.color.fill.whitish,
  minHeight: '100dvh',
});

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
  border: `1px solid ${colorVars.color.border.secondary}`,
  borderRadius: '1.2rem',
  backgroundColor: colorVars.color.bg.primary,
  padding: '4rem 3.2rem',
  width: '36rem',
});

export const title = style({
  ...fontVars.font.title_sb_20,
  textAlign: 'center',
  color: colorVars.color.text.primary,
});

export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.2rem',
});

export const label = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.6rem',
  ...fontVars.font.body_m_14,
  color: colorVars.color.text.secondary,
});

export const input = style({
  border: `1px solid ${colorVars.color.border.primary}`,
  borderRadius: '0.8rem',
  padding: '0 1.2rem',
  height: '4.4rem',
  ...fontVars.font.body_r_14,
  color: colorVars.color.text.primary,
  ':focus': {
    borderColor: colorVars.color.border.strong,
  },
});

export const errorText = style({
  ...fontVars.font.caption_r_12,
  color: colorVars.color.text.danger,
});

export const submitButton = style({
  marginTop: '0.8rem',
  borderRadius: '0.8rem',
  backgroundColor: colorVars.color.fill.primary,
  ...fontVars.font.title_sb_16,
  height: '4.8rem',
  color: colorVars.color.text.inverse,
  ':disabled': {
    backgroundColor: colorVars.color.fill.disabled,
    cursor: 'not-allowed',
  },
});
