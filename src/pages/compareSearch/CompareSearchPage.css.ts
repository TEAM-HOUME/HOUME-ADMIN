import { style } from '@vanilla-extract/css';

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

/** 입력칸 오른쪽에 실행 버튼 */
export const inputRow = style({
  display: 'flex',
  alignItems: 'flex-end',
  gap: '1.2rem',
});

export const inputField = style({
  flex: 1,
  minWidth: 0,
});

/** 입력칸 높이에 맞춘다 */
export const inputButton = style({
  padding: '1.1rem 1.6rem',
});
