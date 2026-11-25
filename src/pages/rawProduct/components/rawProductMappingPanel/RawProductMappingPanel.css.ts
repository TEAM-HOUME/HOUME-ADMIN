import { style } from '@vanilla-extract/css';

import { colorVars } from '@styles/tokens/color.css';
import { fontVars } from '@styles/tokens/font.css';

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem',
});

export const item = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem',
  border: `1px solid ${colorVars.color.border.secondary}`,
  borderRadius: '0.8rem',
  padding: '1.2rem',
});

export const itemSelected = style({
  borderColor: colorVars.color.border.strong,
  backgroundColor: colorVars.color.fill.weak,
});

export const itemTitle = style({
  ...fontVars.font.body_m_13,
  wordBreak: 'keep-all',
  color: colorVars.color.text.primary,
});

export const itemMeta = style({
  ...fontVars.font.caption_r_12,
  color: colorVars.color.text.tertiary,
});
