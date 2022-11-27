export const styleOrder = [
  'global',
  'normal',
  'link',
  'visited',
  'focusWithin',
  'focus',
  'focusVisible',
  'hover',
  'active',
  'keyframes',
  'atRules',
  'media',
] as const;

export type StyleOrder = typeof styleOrder[number];
export type CssRule = { order: StyleOrder; value: string };
