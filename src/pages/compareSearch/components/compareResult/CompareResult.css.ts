import { style } from '@vanilla-extract/css';

import { colorVars } from '@styles/tokens/color.css';
import { fontVars } from '@styles/tokens/font.css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.2rem',
});

export const stats = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '0.4rem',
});

export const statsStep = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
});

export const arrow = style({
  ...fontVars.font.caption_r_12,
  color: colorVars.color.text.tertiary,
});

export const empty = style({
  borderRadius: '0.8rem',
  backgroundColor: colorVars.color.fill.weak,
  padding: '1.2rem',
  ...fontVars.font.body_m_13,
  color: colorVars.color.text.secondary,
});

export const title = style({
  maxWidth: '20rem',
  ...fontVars.font.caption_r_12,
});
