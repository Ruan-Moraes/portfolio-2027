import { defineConfig } from 'steiger';
import fsd from '@feature-sliced/steiger-plugin';

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // Em Next.js App Router, arquivos de rota ficam em src/app e views em src/views
    files: ['./src/**'],
    rules: {
      'fsd/insignificant-slice': 'off',
    },
  },
]);
