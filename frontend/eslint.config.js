import js from '@eslint/js';
import pluginVitest from '@vitest/eslint-plugin';
import checkFile from 'eslint-plugin-check-file';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/node_modules/**', '**/coverage/**', "**/css/**"],
  },

  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'react-refresh': pluginReactRefresh,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // React rules
      ...pluginReact.configs.flat.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      // TypeScript rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        { allowExpressions: true, allowTypedFunctionExpressions: true },
      ],

      // General rules
      curly: ['error', 'all'],
      'nonblock-statement-body-position': ['error', 'below'],
    },
  },

  {
    name: 'app/vitest',
    files: ['**/__tests__/**/*.{ts,tsx}', '**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    ...pluginVitest.configs.recommended,
  },

  {
    name: 'app/tsx-file-naming',
    files: ['**/*.tsx'],
    ignores: ['**/index.tsx'],
    plugins: {
      'check-file': checkFile,
    },
    rules: {
      // React component files (TSX) must be PascalCase
      'check-file/filename-naming-convention': [
        'error',
        {
          '**/*.tsx': 'PASCAL_CASE',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
      // Folders must be kebab-case
      'check-file/folder-naming-convention': [
        'error',
        {
          '**/*': 'KEBAB_CASE',
        },
      ],
    },
  },

  {
    name: 'app/ts-file-naming',
    files: ['**/*.ts'],
    ignores: ['**/*.tsx', 'vite.config.ts', 'vitest.config.ts'],
    plugins: {
      'check-file': checkFile,
    },
    rules: {
      // Non-component TypeScript files must be kebab-case
      'check-file/filename-naming-convention': [
        'error',
        {
          '**/*.ts': 'KEBAB_CASE',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
      // Folders must be kebab-case
      'check-file/folder-naming-convention': [
        'error',
        {
          '**/*': 'KEBAB_CASE',
        },
      ],
    },
  }
);
