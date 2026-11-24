import { style } from '@vanilla-extract/css';

import { colorVars } from '@styles/tokens/color.css';
import { fontVars } from '@styles/tokens/font.css';

export const uploadPanel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.2rem',
  border: `1px dashed ${colorVars.color.border.primary}`,
  borderRadius: '1.2rem',
  padding: '1.6rem',
});

export const uploadRow = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) auto',
  alignItems: 'center',
  gap: '1.2rem',
});

export const fileInput = style({
  ...fontVars.font.body_r_13,
});

export const imageList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.2rem',
  marginTop: '1.6rem',
});

export const imageCard = style({
  display: 'grid',
  gridTemplateColumns: '16rem minmax(0, 1fr) auto',
  gap: '1.6rem',
  border: `1px solid ${colorVars.color.border.secondary}`,
  borderRadius: '1.2rem',
  padding: '1.6rem',
});

export const image = style({
  borderRadius: '0.8rem',
  backgroundColor: colorVars.color.fill.weak,
  objectFit: 'contain',
  width: '16rem',
  height: '12rem',
});

export const imageInfo = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
});

export const imageTitle = style({
  ...fontVars.font.title_sb_14,
  color: colorVars.color.text.primary,
});

export const imageMeta = style({
  ...fontVars.font.caption_r_12,
  wordBreak: 'break-all',
  color: colorVars.color.text.tertiary,
});

export const viewField = style({
  marginTop: '0.8rem',
});

export const imageActions = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.6rem',
});
