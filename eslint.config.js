import js from "@eslint/js";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores([
    "**/dist",
    "**/build",
    "**/out",
    "**/docs",
    "**/coverage",
    "**/next",
    "**/.next",
    "**/.source",
    "**/*cache",
    "**/CHANGELOG*",
  ]),
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      // Allowed unused vars like "__a"
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^([iI][A-Z]|__)",
          argsIgnorePattern: "^([iI][A-Z]|__)",
        },
      ],
    },
  },
  {
    files: ["**/*.jsonc"],
    language: "json/jsonc",
    extends: [json.configs.recommended],
  },
  {
    files: ["**/*.json5"],
    language: "json/json5",
    extends: [json.configs.recommended],
  },
  {
    files: ["**/*.md"],
    language: "markdown/gfm",
    extends: [markdown.configs.recommended],
  },
  // {
  //   files: ["**/*.css"],
  //   plugins: { css },
  //   language: "css/css",
  //   extends: [css.configs.recommended],
  // },
]);
