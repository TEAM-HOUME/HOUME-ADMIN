import { style } from '@vanilla-extract/css';

import { colorVars } from '@styles/tokens/color.css';
import { fontVars } from '@styles/tokens/font.css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.2rem',
  border: `1px solid ${colorVars.color.border.secondary}`,
  borderRadius: '1.2rem',
  backgroundColor: colorVars.color.fill.whitish,
  padding: '1.6rem',
});

export const title = style({
  ...fontVars.font.title_sb_14,
  color: colorVars.color.text.primary,
});

export const row = style({
  display: 'grid',
  gridTemplateColumns: '8rem minmax(0, 1fr) minmax(0, 2fr)',
  gap: '1.2rem',
});
