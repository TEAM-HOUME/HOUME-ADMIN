import { style } from '@vanilla-extract/css';

import { colorVars } from '@styles/tokens/color.css';
import { fontVars } from '@styles/tokens/font.css';

export const description = style({
  marginTop: '-1.6rem',
  marginBottom: '2.4rem',
  ...fontVars.font.body_r_14,
  color: colorVars.color.text.tertiary,
});

/** 텍스트 · 이미지 검색 결과를 나란히 비교한다 */
export const columns = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  alignItems: 'stretch',
  gap: '2.4rem',
});

export const column = style({
  marginBottom: 0,
});

export const columnBody = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.6rem',
});
