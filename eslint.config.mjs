import nextConfig from "eslint-config-next";
import prettier from "eslint-plugin-prettier";
import reactCompiler from "eslint-plugin-react-compiler";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

const eslintConfig = [
  ...nextConfig,
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
      prettier: prettier,
      "react-compiler": reactCompiler,
    },
    rules: {
      "prettier/prettier": "error",
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "react-compiler/react-compiler": "error",
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
    },
  },
];

export default eslintConfig;
