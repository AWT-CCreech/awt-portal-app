import globals from "globals";
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import pluginReact from "eslint-plugin-react";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Disable react/prop-types rule since we're using TypeScript for type-checking
      "react/prop-types": "off",
    },
  },
  js.configs.recommended,  // Correct usage for js
  tseslint.configs.recommended,  // TypeScript ESLint config
  pluginReact.configs.recommended,  // React ESLint config
];
