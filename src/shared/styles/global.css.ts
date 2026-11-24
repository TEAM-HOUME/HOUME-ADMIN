import { globalStyle } from '@vanilla-extract/css';

import { colorVars } from '@styles/tokens/color.css';
import { fontVars } from '@styles/tokens/font.css';
import '@styles/reset.css';
import '@styles/fontFace.css';

/**
 * 어드민 글로벌 스타일.
 * 웹(HOUME-CLIENT)은 모바일 고정 너비 레이아웃이지만, 백오피스는 데스크톱 전체 너비를 쓴다.
 * 토큰(color·font·unit)과 reset은 HOUME-CLIENT에서 그대로 가져왔다.
 */
globalStyle('body', {
  backgroundColor: colorVars.color.bg.primary,
  minWidth: '128rem',
  color: colorVars.color.text.primary,
  fontFamily: fontVars.font.family.pretendard,
});

globalStyle('button', {
  cursor: 'pointer',
});
