import type { CssValue, Selectors } from '../types/common';
import type { AndArray, NestedObj } from '../types/utils';
import { compileCss } from './compileCss';
import { isCssValue } from './isCssValue';
import { isObject } from './isObject';
import { resolveSelectors } from './resolveSelectors';
import { styleDeclarationStringify } from './styleDeclarationStringify';

type Args = {
  style: NestedObj<AndArray<CssValue>>;
  selector: string;
  selectors?: Selectors;
  resolvedStyle?: {
    rules: string[];
  };
};

export const compileNestedCss = ({
  style,
  selector,
  selectors = { atRules: [], nested: '' },
  resolvedStyle = { rules: [] },
}: Args) => {
  const cssBlock: string[] = [];
  for (const property in style) {
    const value = style[property];
    if (isCssValue(value)) {
      cssBlock.push(styleDeclarationStringify({ property, styleValue: value }));
    } else if (isObject(value)) {
      compileNestedCss({
        style: value,
        selector,
        selectors: resolveSelectors({ property, selectors }),
        resolvedStyle,
      });
    }
  }

  if (cssBlock.length !== 0) {
    const cssRule = compileCss({
      selector,
      declaration: cssBlock.join(''),
      selectors,
    });

    resolvedStyle.rules.push(cssRule);
  }
  return resolvedStyle.rules;
};
