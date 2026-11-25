import { style } from '@vanilla-extract/css';

import { colorVars } from '@styles/tokens/color.css';
import { fontVars } from '@styles/tokens/font.css';

/** RAW 상품 화면의 여러 컴포넌트가 같이 쓰는 스타일 */

export const pickerRow = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '1.2rem',
});

export const tagList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.6rem',
});

export const colorDot = style({
  display: 'inline-block',
  flexShrink: 0,
  border: `1px solid ${colorVars.color.border.primary}`,
  borderRadius: '50%',
  width: '1rem',
  height: '1rem',
});

export const mappingBox = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.6rem',
  border: `1px solid ${colorVars.color.border.secondary}`,
  borderRadius: '1.2rem',
  backgroundColor: colorVars.color.fill.whitish,
  padding: '1.6rem',
});

export const mappingTitle = style({
  ...fontVars.font.title_sb_15,
  color: colorVars.color.text.primary,
});

export const checkboxLabel = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
  ...fontVars.font.body_m_13,
  cursor: 'pointer',
  color: colorVars.color.text.primary,
});

export const fourColumns = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: '1.6rem',
});

export const twoSpan = style({
  gridColumn: 'span 2',
});

export const inlineRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
});

export const grow = style({
  flex: 1,
  minWidth: 0,
});
