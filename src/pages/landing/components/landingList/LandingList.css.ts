import { style } from '@vanilla-extract/css';

import { colorVars } from '@styles/tokens/color.css';
import { fontVars } from '@styles/tokens/font.css';

export const list = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(26rem, 1fr))',
  gap: '1.6rem',
});

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.2rem',
  border: `1px solid ${colorVars.color.border.secondary}`,
  borderRadius: '1.2rem',
  padding: '1.6rem',
});

export const cardEditing = style({
  borderColor: colorVars.color.border.strong,
});

export const image = style({
  aspectRatio: '16 / 10',
  borderRadius: '0.8rem',
  backgroundColor: colorVars.color.fill.weak,
  objectFit: 'cover',
  width: '100%',
});

export const titleRow = style({
  display: 'flex',
  alignItems: 'baseline',
  gap: '0.8rem',
});

export const title = style({
  ...fontVars.font.title_sb_15,
  color: colorVars.color.text.primary,
});

export const id = style({
  ...fontVars.font.caption_r_12,
  color: colorVars.color.text.tertiary,
});
