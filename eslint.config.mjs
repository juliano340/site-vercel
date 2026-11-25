import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

// Regras novas do React Hooks 7: os padrões atuais (setState no mount e
// refs "latest value") são intencionais e compatíveis com React 19.
// Aplicadas no mesmo objeto que registra o plugin react-hooks.
const nextVitalsWithOverrides = nextVitals.map((config) =>
  config.plugins?.['react-hooks']
    ? {
        ...config,
        rules: {
          ...config.rules,
          'react-hooks/set-state-in-effect': 'warn',
          'react-hooks/refs': 'warn',
        },
      }
    : config
);

const eslintConfig = defineConfig([
  ...nextVitalsWithOverrides,
  {
    rules: {
      'react/no-unescaped-entities': 'off',
    },
  },
  // Default ignores of eslint-config-next.
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
