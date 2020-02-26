module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb', "plugin:prettier/recommended",
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react', 'prettier'
  ],
  rules: {
    "prettier/prettier": ["error", {
      "singleQuote": true,
      "parser": "flow",
      semi: false,
      "trailingComma": "es5",
      "arrowParens": "avoid",
    }],
    "react/jsx-filename-extension": [0],
    "react/prop-types": [0],
    "react/jsx-props-no-spreading": [0],
    "react/prefer-stateless-function": [0],
    "no-case-declarations": [0],
  },
};
