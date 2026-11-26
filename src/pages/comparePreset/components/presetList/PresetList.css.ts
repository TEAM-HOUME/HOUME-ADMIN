import { style } from '@vanilla-extract/css';

import { colorVars } from '@styles/tokens/color.css';

export const thumbnail = style({
  display: 'block',
  border: `1px solid ${colorVars.color.border.secondary}`,
  borderRadius: '0.6rem',
  objectFit: 'cover',
  width: '4.8rem',
  height: '4.8rem',
});
