import { style } from '@vanilla-extract/css';

import { colorVars } from '@styles/tokens/color.css';
import { fontVars } from '@styles/tokens/font.css';

export const header = style({
  display: 'grid',
  gridTemplateColumns: '14rem minmax(0, 1fr)',
  gap: '2rem',
});

export const image = style({
  display: 'block',
  borderRadius: '1.2rem',
  backgroundColor: colorVars.color.fill.weak,
  objectFit: 'cover',
  width: '14rem',
  height: '14rem',
});

export const title = style({
  ...fontVars.font.title_sb_20,
  color: colorVars.color.text.primary,
});

export const sub = style({
  marginTop: '0.6rem',
  ...fontVars.font.body_r_13,
  color: colorVars.color.text.secondary,
});

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: '1.2rem',
  marginTop: '1.6rem',
});

export const panel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  borderRadius: '1.2rem',
  backgroundColor: colorVars.color.fill.whitish,
  padding: '1.6rem',
});

export const panelTitle = style({
  ...fontVars.font.title_sb_14,
  color: colorVars.color.text.primary,
});

export const label = style({
  display: 'block',
  ...fontVars.font.caption_r_11,
  color: colorVars.color.text.tertiary,
});

export const value = style({
  display: 'block',
  ...fontVars.font.body_m_14,
  wordBreak: 'break-all',
  color: colorVars.color.text.primary,
});

export const link = style({
  ...fontVars.font.caption_r_12,
  textDecoration: 'underline',
  wordBreak: 'break-all',
  color: colorVars.color.text.brand,
});

export const sections = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '1.2rem',
  marginTop: '1.2rem',
});
