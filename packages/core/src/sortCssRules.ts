import type { CssRule } from './styleOrder';
import { styleOrder } from './styleOrder';

export const sortCssRules = (cssRules: CssRule[]) => {
  return cssRules.sort((ruleA, ruleB) => {
    const orderA = ruleA[1];
    const orderB = ruleB[1];
    if (orderA === orderB) return 0;
    return styleOrder.indexOf(orderA) - styleOrder.indexOf(orderB);
  });
};
