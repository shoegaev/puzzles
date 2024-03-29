const path = require("path");
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "airbnb-typescript/base",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: path.resolve(__dirname, "tsconfig.json"),
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/no-explicit-any": "error",
    "no-plusplus": "off",
    "no-console": "warn",
    "max-len": ["warn", { code: 120 }],
    indent: [
      "warn",
      2,
      {
        SwitchCase: 1,
      },
    ],
    "@typescript-eslint/indent": [
      "warn",
      2,
      {
        SwitchCase: 1,
      },
    ],
    "import/prefer-default-export": "off",
    "no-param-reassign": [
      "error",
      {
        props: false,
      },
    ],
    "operator-linebreak": ["error", "after"],
    "@typescript-eslint/quotes": ["error", "double"],
  },
  ignorePatterns: ["*config.js", "*eslintrc.js"],
};
