import { style } from '@vanilla-extract/css';

import { colorVars } from '@styles/tokens/color.css';

export const header = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '1.6rem',
});

export const workspace = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 2fr) minmax(32rem, 1fr)',
  alignItems: 'start',
  gap: '2.4rem',
});

export const dangerCard = style({
  borderColor: colorVars.color.red600,
});
