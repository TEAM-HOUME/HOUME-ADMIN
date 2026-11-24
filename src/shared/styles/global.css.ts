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

/**
 * reset의 `input, textarea, select { all: unset }`이 `* { box-sizing: border-box }`보다
 * 구체적이라 box-sizing이 content-box로 돌아간다. 그러면 width 100% 입력칸이
 * 패딩·테두리만큼 칸 밖으로 넘친다 → 어드민은 폼이 많으므로 다시 border-box로 둔다
 */
globalStyle('input, textarea, select', {
  boxSizing: 'border-box',
});

/**
 * 같은 `all: unset` 때문에 체크박스·라디오가 아예 그려지지 않는다.
 * 브라우저 기본 모양으로 되돌린다 (revert)
 */
globalStyle('input[type="checkbox"], input[type="radio"]', {
  all: 'revert',
  margin: 0,
  cursor: 'pointer',
  width: '1.6rem',
  height: '1.6rem',
  accentColor: colorVars.color.fill.primary,
});

/** fieldset은 그룹 의미만 쓰고 브라우저 기본 테두리·최소 너비는 없앤다 */
globalStyle('fieldset', {
  border: 0,
  minWidth: 0,
});
