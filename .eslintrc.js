module.exports = {
  env: {
    commonjs: true,
    es6: true,
    browser: true,
  },
  extends: [
    "google",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:jest/recommended",
    "prettier",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "no-var": 1,
    "require-jsdoc": 1,
    "eol-last": 0,
    "no-tabs": 0,
    "max-len": 1,
    indent: ["error", "tab"],
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "jest"],
};
