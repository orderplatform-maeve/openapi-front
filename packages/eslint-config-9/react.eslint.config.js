import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import reactRefreshConfig from "eslint-plugin-react-refresh";
import importConfig from "eslint-plugin-import";
import tsParser from "@typescript-eslint/parser";
import {resolve} from "node:path";
const project = resolve(process.cwd(), "tsconfig.json");

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        React: true,
        JSX: true,
      },
      parser: tsParser,
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {
          project,
        },
      },
    },
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: {
      "react-refresh": reactRefreshConfig,
      "import": importConfig,
    },
    rules: {
      /**
       * import
       */
      "import/order": ["error", {
        groups: ["builtin", "external", "parent", "sibling", "index"],

        alphabetize: {
          order: "desc",
        },
      }],

      /**
       * react
       */
      "react/react-in-jsx-scope": "off",
      "react/jsx-props-no-spreading": "off",
      "react/no-unknown-property": ["error", {
        ignore: ["css"],
      }],

      /**
       * react-refresh
       */
      "react-refresh/only-export-components": "warn",

      /**
       * react-hooks
       */
      "react-hooks/exhaustive-deps": "off",

      /**
       * @typesciprt-eslint
       */
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",
      "@typescript-eslint/no-confusing-void-expression": "off",
      "@typescript-eslint/return-await": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/lines-between-class-members": "off",
      "@typescript-eslint/no-throw-literal": "off",
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        }
      ]
    }
  },
];
