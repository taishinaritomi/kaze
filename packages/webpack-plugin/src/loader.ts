import path from 'path';
import * as Babel from '@babel/core';
import { transformPlugin } from '@kaze-style/babel-plugin';
import type { ForBuildGlobalStyle, ForBuildStyle } from '@kaze-style/core';
import evalCode from 'eval';
import type {
  LoaderDefinitionFunction,
  LoaderContext as _LoaderContext,
} from 'webpack';
import type { ChildCompiler } from './compiler';
import { parseSourceMap } from './utils/parseSourceMap';
import { toURIComponent } from './utils/toURIComponent';

type Option = {
  childCompiler?: ChildCompiler;
};

export type WebpackLoaderParams = Parameters<LoaderDefinitionFunction<Option>>;
export type LoaderContext = _LoaderContext<Option> & {
  _compiler: NonNullable<_LoaderContext<Option>['_compiler']>;
  _compilation: NonNullable<_LoaderContext<Option>['_compilation']>;
};

const virtualLoaderPath = '@kaze-style/webpack-plugin/virtualLoader';
const cssPath = '@kaze-style/webpack-plugin/assets/kaze.css';

export const transformedComment = '/* Kaze style Transformed File */';

function loader(
  this: LoaderContext,
  sourceCode: WebpackLoaderParams[0],
  inputSourceMap: WebpackLoaderParams[1],
) {
  this.cacheable(true);
  const { childCompiler } = this.getOptions();
  const isChildCompiler = childCompiler?.isChildCompiler(this._compiler.name);

  if (isChildCompiler) {
    this.callback(null, sourceCode, inputSourceMap);
    return;
  }

  const styles = this.data.styles as ForBuildStyle<string>[] | undefined;

  const globalStyles = this.data.globalStyles as
    | ForBuildGlobalStyle[]
    | undefined;

  if (sourceCode.includes(transformedComment)) {
    const filePath = path.relative(process.cwd(), this.resourcePath);

    const babelFileResult = Babel.transformSync(sourceCode, {
      caller: { name: 'kaze' },
      babelrc: false,
      configFile: false,
      compact: false,
      filename: filePath,
      plugins: [[transformPlugin, { styles: styles || [] }]],
      sourceMaps: this.sourceMap || false,
      sourceFileName: filePath,
      inputSourceMap: parseSourceMap(inputSourceMap) || undefined,
    });

    if (babelFileResult === null) {
      this.callback(null, sourceCode, inputSourceMap);
      return;
    }

    const cssRules: string[] = [];

    if (styles && styles.length !== 0) {
      cssRules.push(...styles.flatMap((style) => style.cssRules));
    }

    if (globalStyles && globalStyles.length !== 0) {
      cssRules.push(
        ...globalStyles.flatMap((globalStyle) => globalStyle.cssRules),
      );
    }

    const request = `import ${JSON.stringify(
      this.utils.contextify(
        this.context || this.rootContext,
        `kaze.css!=!${virtualLoaderPath}!${cssPath}?style=${toURIComponent(
          cssRules.join('\n'),
        )}`,
      ),
    )};`;
    this.callback(
      null,
      `${babelFileResult.code}\n\n${request}`,
      babelFileResult.map as unknown as string,
    );

    return;
  }
  this.callback(null, sourceCode, inputSourceMap);
}

export default loader;

type ForBuild = {
  fileName: string;
  styles: ForBuildStyle<string>[];
  globalStyles: ForBuildGlobalStyle[];
};

export function pitch(this: LoaderContext) {
  this.cacheable(true);

  const { childCompiler } = this.getOptions();
  if (childCompiler) {
    const isChildCompiler = childCompiler.isChildCompiler(this._compiler.name);
    if (!isChildCompiler) {
      const callback = this.async();
      childCompiler
        .getCompiledSource(this)
        .then(({ source }) => {
          if (source.includes(transformedComment)) {
            const __forBuildByKazeStyle: ForBuild = {
              fileName: this.resourcePath,
              styles: [],
              globalStyles: [],
            };
            const window = {};
            evalCode(
              source,
              this.resourcePath,
              {
                console,
                __forBuildByKazeStyle,
                window,
              },
              true,
            );

            if (__forBuildByKazeStyle.styles.length !== 0) {
              this.data.styles = __forBuildByKazeStyle.styles;
            }

            if (__forBuildByKazeStyle.globalStyles.length !== 0) {
              this.data.globalStyles = __forBuildByKazeStyle.globalStyles;
            }
          }
          callback(null);
        })
        .catch((error) => {
          console.error({ resourcePath: this.resourcePath, error });
          callback(null);
        });
    }
  }
}
