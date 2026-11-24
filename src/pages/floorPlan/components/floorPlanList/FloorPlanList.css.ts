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
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  gap: '1.6rem',
  border: `1px solid ${colorVars.color.border.secondary}`,
  borderRadius: '1.2rem',
  padding: '1.6rem',
});

export const cardEditing = style({
  borderColor: colorVars.color.border.strong,
});

export const gallery = style({
  display: 'flex',
  gap: '0.8rem',
  marginBottom: '1.2rem',
  overflowX: 'auto',
});

export const galleryItem = style({
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  gap: '0.4rem',
});

// 높이만 고정하고 너비는 사진 비율을 따른다 → 잘림·여백 없이 사진에 딱 맞는다
export const galleryImage = style({
  display: 'block',
  borderRadius: '0.8rem',
  width: 'auto',
  height: '10rem',
});

export const galleryView = style({
  ...fontVars.font.caption_r_12,
  textAlign: 'center',
  color: colorVars.color.text.tertiary,
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

export const subText = style({
  ...fontVars.font.caption_r_12,
  color: colorVars.color.text.tertiary,
});

export const meta = style({
  display: 'grid',
  gridTemplateColumns: '10rem minmax(0, 1fr)',
  rowGap: '0.8rem',
  columnGap: '1.2rem',
  ...fontVars.font.body_r_13,
  color: colorVars.color.text.secondary,
});

export const metaLabel = style({
  ...fontVars.font.body_m_13,
  color: colorVars.color.text.tertiary,
});

export const actions = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem',
});
