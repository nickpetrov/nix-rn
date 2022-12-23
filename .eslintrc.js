module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  ignorePatterns: ['.sentryclirc'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
      },
    },
  ],
  rules: {
    'react/require-default-props': 'off', // we want to use typescript to set the default properties
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    '@typescript-eslint/no-explicit-any': 'off', // sometimes it's necessary because react-native lacks some types
    'linebreak-style': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-underscore-dangle': 'off', // because __typename and _id needs to be used
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        singleQuote: true,
        trailingComma: 'all',
        bracketSameLine: true,
        printWidth: 80,
        'arrow-body-style': ['error', 'as-needed'],
      },
    ],
  },
};
