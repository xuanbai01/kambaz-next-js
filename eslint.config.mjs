import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript'],
    rules: {
      // Disable rules completely (errors become allowed)
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
      
      // Turn errors into warnings (won't block build)
      "@typescript-eslint/no-explicit-any": "off",
      '@typescript-eslint/no-unused-vars': 'warn',
      '@next/next/no-img-element': 'warn',
      'jsx-a11y/alt-text': 'warn',
      'prefer-const': 'warn',
      'react/jsx-key': 'warn',
    },
  }),
];

export default eslintConfig;