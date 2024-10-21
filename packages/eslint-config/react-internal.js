/**
 * from: https://github.com/torderdev/torderservice-eslint-module-client/blob/master/react-config/eslint/index.js
 */

const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/**
 * @see https://eslint.org/docs/latest/use/configure
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  globals: {
    React: true,
    JSX: true,
  },
  extends: [
    'standard-with-typescript',
    'prettier',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react', '@typescript-eslint', 'react-refresh'],
  rules: {
    /**
     * default rules
     */
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
        alphabetize: { order: 'desc' },
      },
    ],

    /**
     * react
     */
    'react/react-in-jsx-scope': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/no-unknown-property': ['error', { ignore: ['css'] }],

    /**
     * react-refresh
     */
    'react-refresh/only-export-components': 'warn',

    /**
     * react-hooks
     */
    'react-hooks/exhaustive-deps': 'off',

    /**
     * typescript
     */
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/no-confusing-void-expression': 'off',
    '@typescript-eslint/return-await': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',

    /**
     * deprecated rules but cause of lint error
     */
    '@typescript-eslint/lines-between-class-members': 'off',
    '@typescript-eslint/no-throw-literal': 'off',
    '@typescript-eslint/ban-types': 'off',
  },
};
