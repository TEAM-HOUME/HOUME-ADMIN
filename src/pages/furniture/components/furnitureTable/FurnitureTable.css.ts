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
  padding: '1.2rem',
  verticalAlign: 'top',
});

export const tagList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem',
});

export const tagRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1.2rem',
  borderRadius: '0.8rem',
  padding: '0.8rem',
});

export const tagRowSelected = style({
  backgroundColor: colorVars.color.fill.weak,
});

export const tagImage = style({
  display: 'block',
  flexShrink: 0,
  borderRadius: '0.4rem',
  width: '6rem',
  height: 'auto',
});

export const tagMeta = style({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  gap: '0.2rem',
});

export const tagName = style({
  ...fontVars.font.body_m_14,
  color: colorVars.color.text.primary,
});

export const tagSub = style({
  ...fontVars.font.caption_r_12,
  color: colorVars.color.text.tertiary,
});
