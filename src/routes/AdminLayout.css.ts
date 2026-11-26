import { style } from '@vanilla-extract/css';

import { colorVars } from '@styles/tokens/color.css';
import { fontVars } from '@styles/tokens/font.css';

export const layout = style({
  display: 'flex',
  minHeight: '100dvh',
});

export const sidebar = style({
  position: 'sticky',
  top: 0,
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  borderRight: `1px solid ${colorVars.color.border.secondary}`,
  backgroundColor: colorVars.color.fill.whitish,
  padding: '2.4rem 1.6rem',
  width: '24rem',
  height: '100dvh',
  overflowY: 'auto',
});

export const logo = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
  marginBottom: '2.4rem',
  padding: '0 0.8rem',
  ...fontVars.font.title_sb_18,
  color: colorVars.color.text.primary,
});

export const logoImage = style({
  flexShrink: 0,
  width: '2.4rem',
  height: '2.4rem',
});

export const menuList = style({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  gap: '0.4rem',
});

const menuItemBase = style({
  display: 'block',
  borderRadius: '0.8rem',
  padding: '1rem 0.8rem',
  ...fontVars.font.body_m_14,
});

export const menuItem = style([
  menuItemBase,
  {
    color: colorVars.color.text.secondary,
    ':hover': {
      backgroundColor: colorVars.color.fill.weak,
    },
    selectors: {
      '&.active': {
        backgroundColor: colorVars.color.fill.primary,
        color: colorVars.color.text.inverse,
      },
    },
  },
]);

export const menuItemDisabled = style([
  menuItemBase,
  {
    cursor: 'not-allowed',
    color: colorVars.color.text.disabled,
  },
]);

export const logoutButton = style({
  marginTop: '1.6rem',
  borderRadius: '0.8rem',
  padding: '1rem 0.8rem',
  ...fontVars.font.body_m_14,
  textAlign: 'left',
  color: colorVars.color.text.tertiary,
  ':hover': {
    backgroundColor: colorVars.color.fill.weak,
  },
});

export const content = style({
  flex: 1,
  padding: '3.2rem 4rem',
  minWidth: 0,
});
