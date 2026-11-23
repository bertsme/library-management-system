import { defineConfig } from 'vitest/config';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

export default defineConfig({
  // Resolves the path aliases declared in tsconfig.json, including the ones
  // added by `nest g library`. Requires Vite 8, which ships this option.
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
    include: ['**/*.spec.ts'],
  },
});
