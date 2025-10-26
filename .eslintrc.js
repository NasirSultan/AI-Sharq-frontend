module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:unused-imports/recommended', // ✅ Use this instead of manually adding rules
  ],
  plugins: ['@typescript-eslint', 'react', 'unused-imports'],
  rules: {
    // Optional: further tweak behavior
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    // You can also turn off the base rule to avoid conflicts
    '@typescript-eslint/no-unused-vars': 'off',
  },
};
