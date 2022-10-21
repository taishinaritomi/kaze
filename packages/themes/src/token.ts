import { fontSize } from './fontSize';
import { fontWeight } from './fontWeight';
import { size } from './size';

export const token = {
  size: (num: keyof typeof size) => {
    return size[num];
  },
  fontWeight: (weight: keyof typeof fontWeight) => {
    return fontWeight[weight];
  },
  fontSize: (size: keyof typeof fontSize) => {
    return fontSize[size];
  },
};
