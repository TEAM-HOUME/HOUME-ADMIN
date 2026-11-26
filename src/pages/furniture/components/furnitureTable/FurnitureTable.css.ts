import { style } from '@vanilla-extract/css';

import { colorVars } from '@styles/tokens/color.css';
import { fontVars } from '@styles/tokens/font.css';

export const table = style({
  width: '100%',
  borderCollapse: 'collapse',
  ...fontVars.font.body_r_14,
  color: colorVars.color.text.primary,
});

export const th = style({
  borderBottom: `1px solid ${colorVars.color.border.primary}`,
  padding: '1rem 1.2rem',
  ...fontVars.font.body_m_13,
  textAlign: 'left',
  color: colorVars.color.text.tertiary,
});

export const td = style({
  borderBottom: `1px solid ${colorVars.color.border.secondary}`,
  padding: '1.2rem',
  verticalAlign: 'top',
});

/** 태그 한 줄 높이 = 이미지 6rem + 위아래 여백 0.8rem */
const TAG_ROW_HEIGHT = '7.6rem';

/** ID · 가구 이름 · 가구 삭제 버튼을 첫 번째 태그 줄과 같은 높이(세로 가운데)에 둔다 */
export const firstRowCell = style({
  display: 'flex',
  alignItems: 'center',
  padding: '0.8rem 0',
  minHeight: TAG_ROW_HEIGHT,
});

/**
 * ID · 가구 이름 글자는 가운데가 아니라 첫 줄 버튼의 위쪽 테두리 높이에서 시작한다.
 * 버튼 높이 ≈ 3.75rem → (6rem - 3.75rem) / 2 ≈ 1.1rem + 줄 여백 0.8rem
 */
export const textCell = style({
  alignItems: 'flex-start',
  paddingTop: '1.8rem',
});

/** 가구 삭제 버튼은 칸 오른쪽에 붙인다 */
export const actionCell = style({
  justifyContent: 'flex-end',
});

export const tagList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem',
});

export const tagRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1.2rem',
  borderRadius: '0.8rem',
  padding: '0.8rem',
  minHeight: TAG_ROW_HEIGHT,
});

export const tagRowSelected = style({
  backgroundColor: colorVars.color.fill.weak,
});

export const tagImage = style({
  display: 'block',
  flexShrink: 0,
  borderRadius: '0.4rem',
  objectFit: 'contain',
  width: '6rem',
  // 줄 높이를 일정하게 맞추려고 정사각형 안에 비율을 유지해 넣는다
  height: '6rem',
});

export const tagMeta = style({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  gap: '0.2rem',
});

export const tagName = style({
  ...fontVars.font.body_m_14,
  color: colorVars.color.text.primary,
});

export const tagSub = style({
  ...fontVars.font.caption_r_12,
  color: colorVars.color.text.tertiary,
});
