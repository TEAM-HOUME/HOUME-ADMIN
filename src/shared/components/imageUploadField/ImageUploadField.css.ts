import { style } from '@vanilla-extract/css';

import { colorVars } from '@styles/tokens/color.css';
import { fontVars } from '@styles/tokens/font.css';

export const panel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.2rem',
  border: `1px dashed ${colorVars.color.border.primary}`,
  borderRadius: '1.2rem',
  padding: '1.6rem',
});

export const actions = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1.2rem',
});

export const fileInput = style({
  flex: 1,
  ...fontVars.font.body_r_13,
});

export const preview = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1.6rem',
});

export const previewImage = style({
  borderRadius: '0.8rem',
  backgroundColor: colorVars.color.fill.weak,
  objectFit: 'cover',
  width: '16rem',
  height: '10rem',
});

export const previewLink = style({
  ...fontVars.font.caption_r_12,
  textDecoration: 'underline',
  wordBreak: 'break-all',
  color: colorVars.color.text.brand,
});
