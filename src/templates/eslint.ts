module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  extends: ["eslint:recommended"],
  rules: {
    camelcase: ["error"],
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    "no-console": "off",
    "no-trailing-spaces": ["error"],
    quotes: ["error", "single"],
    semi: ["error", "always"],
  },
};
