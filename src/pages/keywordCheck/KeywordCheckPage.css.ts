import { style } from '@vanilla-extract/css';

export const inputRow = style({
  display: 'grid',
  gridTemplateColumns: '2fr 1fr',
  alignItems: 'end',
  gap: '1.6rem',
});

export const nameField = style({
  minWidth: 0,
});

export const submitButton = style({
  padding: '1.1rem 1.4rem',
  width: '100%',
});

export const resultGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '1.6rem',
});
