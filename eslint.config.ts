import { globalIgnores } from "eslint/config";
import { defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript";
import pluginVue from "eslint-plugin-vue";
import pluginVitest from "@vitest/eslint-plugin";
import pluginOxlint from "eslint-plugin-oxlint";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";

export default defineConfigWithVueTs(
  {
    name: "app/files-to-lint",
    files: ["**/*.{ts,mts,tsx,vue}"],
  },

  globalIgnores(["**/dist/**", "**/dist-ssr/**", "**/coverage/**"]),

  pluginVue.configs["flat/essential"],
  vueTsConfigs.recommended,

  {
    ...pluginVitest.configs.recommended,
    files: ["src/**/__tests__/*"],
  },

  // Custom Vue and TypeScript rules for better code quality
  {
    name: "app/vue-rules",
    files: ["**/*.vue"],
    rules: {
      // Enforce consistent API style - use script setup
      "vue/component-api-style": ["error", ["script-setup"]],

      // Force TypeScript types for props
      "vue/define-props-declaration": ["error", "type-based"],

      // Flag unused properties to remove dead code
      "vue/no-unused-properties": [
        "error",
        {
          deepData: true,
          groups: ["props", "data", "computed", "methods", "setup"],
        },
      ],

      // Use new useTemplateRef API for template refs
      "vue/prefer-use-template-ref": "error",

      // Require typed refs
      "vue/require-typed-ref": "error",

      // Limit template nesting depth
      "vue/max-template-depth": ["error", { maxDepth: 7 }],
    },
  },

  ...pluginOxlint.configs["flat/recommended"],
  skipFormatting,
);
