import { style } from '@vanilla-extract/css';

import { colorVars } from '@styles/tokens/color.css';
import { fontVars } from '@styles/tokens/font.css';

export const filters = style({
  display: 'grid',
  gridTemplateColumns: '2fr 1fr 1fr auto',
  alignItems: 'end',
  gap: '1.2rem',
});

export const toolbar = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1.2rem',
  padding: '1.2rem 0',
});

export const toolbarLeft = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1.2rem',
});

export const checkboxLabel = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
  ...fontVars.font.body_m_13,
  cursor: 'pointer',
  color: colorVars.color.text.primary,
});

export const smallSelect = style({
  padding: '0.6rem 1rem',
  width: 'auto',
});

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(36rem, 1fr))',
  gap: '1.6rem',
});

export const pagination = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1.2rem',
  marginTop: '2rem',
});

export const pageMeta = style({
  ...fontVars.font.caption_r_12,
  color: colorVars.color.text.tertiary,
});

export const pages = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
});

export const pageButtonActive = style({
  borderColor: colorVars.color.border.strong,
});

export const ellipsis = style({
  padding: '0 0.4rem',
  color: colorVars.color.text.tertiary,
});
