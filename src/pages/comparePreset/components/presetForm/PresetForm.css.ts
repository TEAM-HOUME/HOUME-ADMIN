import { style, styleVariants } from '@vanilla-extract/css';

import { colorVars } from '@styles/tokens/color.css';

/** SSR(Bootstrap col-md-6 · 3 · 2)과 같은 비율 */
export const basicGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
  gap: '1.6rem',
});

export const span = styleVariants({
  half: { gridColumn: 'span 6' },
  quarter: { gridColumn: 'span 3' },
  sixth: { gridColumn: 'span 2' },
});

export const items = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem',
});

export const itemsHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const errorBox = style({
  color: colorVars.color.text.danger,
});
