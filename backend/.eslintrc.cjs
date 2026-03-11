module.exports = {
  env: {
    node: true,
    es2022: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  extends: ["eslint:recommended"],
  rules: {
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_|next|req|res" }],
  },
  overrides: [
    {
      files: ["**/*.test.js", "**/*.spec.js"],
      env: {
        jest: true,
        es2022: true,
      },
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
      rules: {
        "no-unused-vars": "off",
      },
    },
  ],
};
