import { style } from '@vanilla-extract/css';

import { colorVars } from '@styles/tokens/color.css';
import { fontVars } from '@styles/tokens/font.css';

export const fieldset = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.6rem',
});

/** legend는 flex 항목이 되지 않아 gap이 안 먹는다 → 여백을 직접 준다 */
export const legend = style({
  marginBottom: '0.6rem',
  ...fontVars.font.body_m_13,
  color: colorVars.color.text.secondary,
});

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
  selectors: {
    // 선택된 항목은 카드째 강조해서 한눈에 보이게 한다
    '&:has(input:checked)': {
      borderColor: colorVars.color.border.strong,
      backgroundColor: colorVars.color.fill.weak,
    },
  },
});
