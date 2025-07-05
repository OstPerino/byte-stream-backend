// @ts-check
import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  {
    plugins: {
      '@stylistic': stylistic,
    },

    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'no-unused-vars': ['error'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/comma-dangle': ['error', 'always'],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/no-multiple-empty-lines': ['error', { "max": 1, "maxEOF": 0, "maxBOF": 0 }],
      '@stylistic/semi': 'error',
      '@stylistic/semi-style': ['error', 'last'],
      '@stylistic/computed-property-spacing': ['error', 'never'],
      '@stylistic/max-len': ['error', { "code": 100 }],
      '@stylistic/no-multi-spaces': ['error'],
      '@stylistic/type-annotation-spacing': 'error',
    },
  },
);
