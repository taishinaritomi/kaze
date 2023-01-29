<div>
  <br />
  <br />
  <div align="center">
    <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/taishinaritomi/kaze-style/main/assets/kaze-light.svg">
    <img width="300" height="auto" alt="Kaze" src="https://raw.githubusercontent.com/taishinaritomi/kaze-style/main/assets/kaze-dark.svg">
  </picture>
  </div>
  <br />
  <br />
  <hr />
  <br />
  <p align="center">Kaze [風] zero-runtime CSS in JS<p>
  <p align="center"><b>🚧 under development 🚧</b></p>
  <div align="center">
    <a href='https://www.npmjs.com/package/@kaze-style/core'>
      <img src='https://img.shields.io/npm/v/@kaze-style/core?style=for-the-badge'>
    </a>
    <a href='https://github.com/taishinaritomi/kaze-style/blob/main/LICENSE'>
      <img src='https://img.shields.io/github/license/taishinaritomi/kaze-style?style=for-the-badge'>
    </a>
    <a href='https://bundlephobia.com/package/@kaze-style/core'>
      <img src='https://img.shields.io/bundlephobia/minzip/@kaze-style/core?style=for-the-badge'>
    </a>
    <a href='https://github.com/microsoft/typescript'>
      <img src='https://img.shields.io/npm/types/@kaze-style/core?style=for-the-badge'>
    </a>
  </div>
  <br />
</div>

# Features

- **Extract** - Can choose when to extract css is buildtime or runtime(RSC is buildtime only)
- **Atomic** - Select atomic css with $
- **Merge** - Style merging ignoring css specificity (atomic css only)
- **Minimal** - [0.3kb](https://shakerphobia.netlify.app/?imports=ClassName,mergeStyle,__globalStyle,__style&pkg=@kaze-style/core) runtime by buildtime extract
- **TypeScript** - Type-safe styles via [csstype](https://github.com/frenic/csstype)
- **Theme** - Consistent styling using "@kaze-style/themes"

# Example

```ts
// App.style.ts
import { createStyle, createGlobalStyle } from '@kaze-style/core';

createGlobalStyle({
  html: {
    lineHeight: '1.5',
  },
});

export const classes = createStyle({
  //Not Atomic CSS
  container: {
    margin: '20px',
    padding: '20px',
  },
  //Atomic CSS
  $base: {
    color: 'red',
    background: 'black',
  },
  //Atomic CSS
  $action: {
    color: 'blue',
  },
});
```

```ts
// App.tsx
import { mergeStyle } from '@kaze-style/core';
import { classes } from './App.style';

export const App = ({ action }) => {
  return (
    <div className={style.container}>
      <p className={mergeStyle(classes.$base, action && classes.$action)}></p>
    </div>
  );
};
```

### Setup Next.js（buildtime extract）

```ts
//next.config.mjs
import { withKazeStyle } from '@kaze-style/next-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withKazeStyle(nextConfig);
```

# Inspiration

KazeStyle was designed with reference to several CSS in JS libraries.

[microsoft/griffel](https://github.com/microsoft/griffel)

[seek-oss/vanilla-extract](https://github.com/seek-oss/vanilla-extract)

[argyleink/open-props](https://github.com/argyleink/open-props)

[callstack/linaria](https://github.com/callstack/linaria)

# Author

[Taishi Naritomi](https://github.com/taishinaritomi)

# License

[MIT](https://github.com/taishinaritomi/kaze-style/blob/main/LICENSE)
