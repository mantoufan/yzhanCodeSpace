module.exports = {
  env: {
    node: true,
    jest: true,
    browser: true
  },
  globals: {
    ga: true,
    chrome: true,
    __DEV__: true
  },
  // parser: '@typescript-eslint/parser',
  parser: 'vue-eslint-parser', // 主解析器
  parserOptions : {
    file: './src/*.*',
    parser: '@typescript-eslint/parser', // 解析 SFC 里的 typescript
    ecmaVersion: 2015,
    ecmaFeatures: {
      jsx: true
    },
    sourceType: "module"
  },
  extends: [
    'eslint:recommended'
  ],
  rules: {
    'prettier/prettier': 'error'
  },
  pulgins: [
    'prettier'
  ]
}
