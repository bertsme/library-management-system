import { defineConfig } from 'vitest/config';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

export default defineConfig({
  plugins: [
    {
      name: 'prefer-typescript-source-for-esm-imports',
      enforce: 'pre',
      resolveId(source, importer) {
        if (!importer || !source.startsWith('.') || !source.endsWith('.js'))
          return null;
        const tsSource = resolve(
          dirname(importer),
          `${source.slice(0, -3)}.ts`,
        );
        return existsSync(tsSource) ? tsSource : null;
      },
    },
  ],
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
  },
});
