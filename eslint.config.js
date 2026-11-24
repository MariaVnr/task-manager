const js = require('@eslint/js');
const globals = require('globals');
const prettier = require('eslint-config-prettier');

module.exports = [
  js.configs.recommended,
  prettier,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
    rules: {
      'no-unused-vars': 'error',
      eqeqeq: 'error',
      'no-console': 'warn',
    },
  },
  { ignores: ['node_modules/', 'coverage/', 'dist/'] },
];
