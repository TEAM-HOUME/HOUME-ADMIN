import { style } from '@vanilla-extract/css';

import { colorVars } from '@styles/tokens/color.css';

export const container = style({
  display: 'flex',
  alignItems: 'flex-end',
  gap: '1.6rem',
});

export const grid = style({
  display: 'grid',
  flex: 1,
  gridTemplateColumns: '2fr 1.5fr 1.5fr',
  gap: '1.6rem',
});

export const preview = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
});

export const previewImage = style({
  border: `1px solid ${colorVars.color.border.secondary}`,
  borderRadius: '0.6rem',
  objectFit: 'cover',
  width: '8rem',
  height: '8rem',
});
