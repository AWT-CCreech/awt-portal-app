import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

export default [
    {
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: "module",
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                myCustomGlobal: "readonly", // Add any additional globals here
            },
        },
        settings: {
            react: {
                version: "detect", // Automatically detect the React version
            },
        },
        plugins: {
            "@typescript-eslint": typescriptPlugin,
            react: reactPlugin,
            prettier: prettierPlugin,
        },
        extends: [
            'eslint:recommended',
            'plugin:react/recommended',
            'plugin:@typescript-eslint/recommended',
            'plugin:prettier/recommended',
        ],
        rules: {
            // Custom rules
            "no-console": "warn",
            "no-debugger": "error",
            "no-unused-vars": ["warn", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }],
            "prettier/prettier": ["error"],
            // Add more custom rules as needed
        },
    },
    {
        ignores: ["**/*.cjs", "**/*.mjs", "build/**", "node_modules/**"],
    },
];