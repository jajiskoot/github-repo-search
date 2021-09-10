module.exports = {
  root: true,
  extends: ["airbnb", "prettier", "prettier/react"],
  plugins: ["react-hooks", "prettier"],
  env: {
    browser: true,
    jest: true
  },
  parser: "babel-eslint",
  rules: {
    "no-plusplus": 0,
    "no-underscore-dangle": 0,
    "no-unused-vars": 2,
    "prettier/prettier": [
      "error",
      {
        "bracketSpacing": true,
        "printWidth": 120,
        "semi": true,
        "singleQuote": true,
        "tabWidth": 4,
        "trailingComma": "none"
      }
    ],
    "react/jsx-filename-extension": [2, { "extensions": [".js"] }],
    "react/jsx-indent": 0,
    "react/jsx-indent-props": [2, 4],
    "react-hooks/rules-of-hooks": 2,
    "react-hooks/exhaustive-deps": 2
  }
};
