import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

export default [
    // Define global settings
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
    },

    // Apply ESLint: Recommended Rules
    {
        files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
        rules: {
            "no-console": "warn",
            "no-debugger": "error",
            "no-unused-vars": ["warn", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }],
            // Add more recommended ESLint rules as needed
        },
    },

    // Apply React: Recommended Rules
    {
        files: ["**/*.jsx", "**/*.tsx"],
        plugins: {
            react: reactPlugin,
        },
        rules: {
            "react/display-name": "warn",
            "react/prop-types": "off", // Disable prop-types as TypeScript handles it
            // Add more React-specific rules as needed
        },
    },

    // Apply TypeScript: Recommended Rules
    {
        files: ["**/*.ts", "**/*.tsx"],
        plugins: {
            "@typescript-eslint": typescriptPlugin,
        },
        rules: {
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/no-unused-vars": ["error", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }],
            // Add more TypeScript-specific rules as needed
        },
    },

    // Apply Prettier Rules
    {
        files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            "prettier/prettier": ["error", {
                semi: true, // Enable semicolons
                singleQuote: true,
                trailingComma: "es5",
                jsxSingleQuote: false,
                endOfLine: "auto"
            }],
        },
    },

    // General ESLint Rules
    {
        files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
        rules: {
            "semi": ["warn", "always"], // Enforce semicolons
            "quotes": ["error", "single"], // Enforce single quotes
            // Add more general ESLint rules as needed
        },
    },

    // Ignore patterns
    {
        ignores: ["**/*.cjs", "**/*.mjs", "build/**", "node_modules/**"],
    },
];
