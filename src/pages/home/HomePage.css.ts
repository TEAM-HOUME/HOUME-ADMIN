import { style } from '@vanilla-extract/css';

import { colorVars } from '@styles/tokens/color.css';
import { fontVars } from '@styles/tokens/font.css';

export const title = style({
  ...fontVars.font.title_sb_24,
  color: colorVars.color.text.primary,
});

export const description = style({
  marginTop: '0.8rem',
  ...fontVars.font.body_r_14,
  color: colorVars.color.text.tertiary,
});
