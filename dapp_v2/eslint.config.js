import { fixupPluginRules } from "@eslint/compat";
import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import reactRefreshPlugin from 'eslint-plugin-react-refresh'
import vitestPlugin from 'eslint-plugin-vitest'
import globals from 'globals'

const filterGlobals = (obj) => {
  return Object.fromEntries(Object.entries(obj).filter(([key]) => key.trim() === key))
}

export default [
  js.configs.recommended,
  {
    ignores: [
      'dist/**/*',
      'src/components/connect/CustomConnectButton.tsx',
      'src/hooks/useAAtransfer.ts',
      'src/components/paymaster/Paymaster.tsx'
    ],
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...filterGlobals(globals.browser),
        ...filterGlobals(globals.node),
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': fixupPluginRules(reactHooksPlugin),
      'react-refresh': reactRefreshPlugin,
      import: importPlugin,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      "no-console": ["error", { "allow": ["warn", "error"] }],
      // TypeScript rules
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],

      // React rules
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/no-unescaped-entities': 'off',

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // React Refresh rule
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Import rule
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'object',
            'type',
            'index',
          ],
          'newlines-between': 'never',
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: { order: 'asc', caseInsensitive: true },
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.test.{js,jsx,ts,tsx}'],
    plugins: {
      vitest: vitestPlugin,
    },
    rules: {
      'vitest/consistent-test-it': ['error', { fn: 'test' }],
    },
  },
  {
    ignores: ['dist/**/*', 'src/components/connect/CustomConnectButton.tsx'],
  },
]
