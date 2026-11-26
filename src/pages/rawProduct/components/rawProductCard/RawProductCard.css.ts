import { style } from '@vanilla-extract/css';

import { colorVars } from '@styles/tokens/color.css';
import { fontVars } from '@styles/tokens/font.css';

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.2rem',
  border: `1px solid ${colorVars.color.border.secondary}`,
  borderRadius: '1.2rem',
  backgroundColor: colorVars.color.bg.primary,
  padding: '1.6rem',
  minWidth: 0,
});

export const cardSelected = style({
  borderColor: colorVars.color.border.strong,
});

export const top = style({
  display: 'grid',
  gridTemplateColumns: 'auto 8rem minmax(0, 1fr)',
  alignItems: 'start',
  gap: '1.2rem',
});

export const thumb = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '0.8rem',
  backgroundColor: colorVars.color.fill.weak,
  width: '8rem',
  ...fontVars.font.caption_m_12,
  height: '8rem',
  overflow: 'hidden',
  color: colorVars.color.text.tertiary,
});

export const thumbImage = style({
  objectFit: 'cover',
  width: '100%',
  height: '100%',
});

export const title = style({
  display: '-webkit-box',
  ...fontVars.font.title_sb_14,
  overflow: 'hidden',
  color: colorVars.color.text.primary,
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
});

export const subtitle = style({
  marginTop: '0.4rem',
  ...fontVars.font.caption_r_12,
  color: colorVars.color.text.tertiary,
});

export const badge = style({
  display: 'inline-block',
  marginTop: '0.6rem',
  borderRadius: '10rem',
  padding: '0.2rem 0.8rem',
  ...fontVars.font.caption_m_12,
});

export const exposed = style({
  backgroundColor: colorVars.color.green200,
  color: colorVars.color.green600,
});

export const hidden = style({
  backgroundColor: colorVars.color.fill.weak,
  color: colorVars.color.text.tertiary,
});

export const meta = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '0.8rem',
  borderRadius: '0.8rem',
  backgroundColor: colorVars.color.fill.whitish,
  padding: '1rem 1.2rem',
});

export const metaLabel = style({
  display: 'block',
  ...fontVars.font.caption_r_11,
  color: colorVars.color.text.tertiary,
});

export const metaValue = style({
  display: 'block',
  ...fontVars.font.body_m_13,
  wordBreak: 'break-all',
  color: colorVars.color.text.primary,
});

export const sectionLabel = style({
  marginBottom: '0.4rem',
  ...fontVars.font.caption_m_12,
  color: colorVars.color.text.tertiary,
});

export const link = style({
  display: 'inline-flex',
  alignItems: 'center',
});
