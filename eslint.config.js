import js from '@eslint/js';
import ts from 'typescript-eslint';
import react from 'eslint-plugin-react';
import prettier from 'eslint-plugin-prettier';
import configPrettier from 'eslint-config-prettier';

export default ts.config({
  extends: [js.configs.recommended, react.configs.recommended, configPrettier],
  plugins: { prettier },
  languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
  files: ['**/*.{ts,tsx}'],
  rules: { 'prettier/prettier': 'error' },
});
