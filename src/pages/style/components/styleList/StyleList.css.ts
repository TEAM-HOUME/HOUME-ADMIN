import { style } from '@vanilla-extract/css';

import { colorVars } from '@styles/tokens/color.css';
import { fontVars } from '@styles/tokens/font.css';

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.2rem',
});

export const card = style({
  display: 'grid',
  gridTemplateColumns: '20rem minmax(0, 1fr) auto',
  gap: '2rem',
  border: `1px solid ${colorVars.color.border.secondary}`,
  borderRadius: '1.2rem',
  padding: '1.6rem',
});

export const cardEditing = style({
  borderColor: colorVars.color.border.strong,
});

export const image = style({
  borderRadius: '0.8rem',
  backgroundColor: colorVars.color.fill.weak,
  objectFit: 'cover',
  width: '20rem',
  height: '13rem',
});

export const titleRow = style({
  display: 'flex',
  alignItems: 'baseline',
  gap: '0.8rem',
  marginBottom: '1.2rem',
});

export const title = style({
  ...fontVars.font.title_sb_16,
  color: colorVars.color.text.primary,
});

export const id = style({
  ...fontVars.font.caption_r_12,
  color: colorVars.color.text.tertiary,
});

export const meta = style({
  display: 'grid',
  gridTemplateColumns: '12rem minmax(0, 1fr)',
  rowGap: '0.8rem',
  columnGap: '1.2rem',
  ...fontVars.font.body_r_13,
  color: colorVars.color.text.secondary,
});

export const metaLabel = style({
  ...fontVars.font.body_m_13,
  color: colorVars.color.text.tertiary,
});

export const tagList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.6rem',
});

export const actions = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem',
});
