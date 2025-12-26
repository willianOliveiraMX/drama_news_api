import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["dist/**", "node_modules/**", "*.js", "!eslint.config.mjs", "!eslintrc.js"]
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js }, 
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser }
  },
  tseslint.configs.recommended,
]);
