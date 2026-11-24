import { style } from '@vanilla-extract/css';

import { colorVars } from '@styles/tokens/color.css';
import { fontVars } from '@styles/tokens/font.css';

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(16rem, 1fr))',
  gap: '0.8rem',
});

export const option = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
  border: `1px solid ${colorVars.color.border.secondary}`,
  borderRadius: '0.8rem',
  cursor: 'pointer',
  ...fontVars.font.body_m_14,
  padding: '1rem 1.2rem',
  color: colorVars.color.text.primary,
});
