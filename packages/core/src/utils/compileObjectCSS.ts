import type { CssRules, KazeGlobalStyle, KazeStyle } from '../types/style';
import { hyphenateProperty } from './hyphenateProperty';

export const compileObjectCSS = (
  style: KazeStyle | KazeGlobalStyle,
): string => {
  const cssRules: CssRules = [];
  for (const property in style) {
    const value = style[property as keyof (KazeStyle | KazeGlobalStyle)];
    if (typeof value === 'string' || typeof value === 'number') {
      cssRules.push(hyphenateProperty(property) + ':' + value + ';');
    }
  }
  return cssRules.join('');
};
