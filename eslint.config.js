// @ts-check
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginVue from "eslint-plugin-vue";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/storybook-static/**",
      "**/node_modules/**",
      "**/coverage/**",
      "**/*.min.js",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-empty-object-type": "off",
      // 组件库对外暴露的 props 类型定义在独立 .ts 文件中，运行时校验由 Vue 自己做
      "vue/multi-word-component-names": "off",
    },
  },
  {
    files: ["**/*.stories.ts", "**/*.stories.mts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    // 提交钩子跑在 Node 里，不是浏览器
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      globals: {
        process: "readonly",
        console: "readonly",
      },
    },
  },
  eslintConfigPrettier,
);
