import { style, styleVariants } from '@vanilla-extract/css';

import { colorVars } from '@styles/tokens/color.css';

export const container = style({
  border: `1px solid ${colorVars.color.border.secondary}`,
  borderRadius: '0.8rem',
  backgroundColor: colorVars.color.fill.weak,
  padding: '1.6rem',
});

/** SSR(Bootstrap 12칸 그리드)과 비슷한 비율로 칸을 나눈다 */
export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
  alignItems: 'end',
  gap: '1.2rem',
});

export const span = styleVariants({
  sm: { gridColumn: 'span 2' },
  md: { gridColumn: 'span 3' },
  lg: { gridColumn: 'span 4' },
});

export const removeCell = style({
  gridColumn: 'span 2',
});
