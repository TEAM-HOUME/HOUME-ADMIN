import { style } from '@vanilla-extract/css';

export const inputRow = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  alignItems: 'end',
  gap: '1.6rem',
});

export const nameField = style({
  minWidth: 0,
});

/** 입력칸 높이에 맞춘다 (버튼 너비는 글자만큼) */
export const submitButton = style({
  padding: '1.1rem 1.6rem',
});

export const resultGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '1.6rem',
});
