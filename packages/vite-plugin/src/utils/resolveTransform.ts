import { extractionStyle, preTransform, transform } from '@kaze-style/build';
import type { Loader } from 'esbuild';
import { build } from 'esbuild';

type Args = {
  filename: string;
  code: string;
  compiler: 'swc' | 'babel';
};

export const resolveTransform = async ({ code, filename, compiler }: Args) => {
  const [preTransformedCode, metadata] = await preTransform(
    code,
    {
      filename,
      preTransformOptions: {
        filename,
      },
    },
    compiler,
  );

  if (preTransformedCode && metadata?.isTransformed) {
    const result = await build({
      entryPoints: [filename],
      bundle: true,
      write: false,
      platform: 'node',
      absWorkingDir: process.cwd(),
      outfile: filename + '.out',
      plugins: [
        {
          name: 'kaze-style-pre-transform',
          setup(build) {
            build.onLoad(
              { filter: new RegExp('^' + filename + '$') },
              ({ path: buildPath }) => {
                return {
                  contents: preTransformedCode,
                  loader: buildPath.split('.').pop() as Loader,
                };
              },
            );
          },
        },
      ],
    });

    const { styles, cssRules } = extractionStyle({
      code: result.outputFiles[0]?.text || '',
      filename,
    });

    const [transformedCode] = await transform(
      preTransformedCode,
      {
        filename,
        transformOptions: { styles },
      },
      compiler,
    );

    return {
      code: transformedCode,
      cssRules,
    };
  } else {
    return {
      code,
      cssRules: [],
    };
  }
};
