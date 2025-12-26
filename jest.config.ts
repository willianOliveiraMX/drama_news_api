import type { Config } from "jest";

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/tests/**/*.test.ts',
    '**/__tests__/**/*.test.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        module: 'commonjs',
        esModuleInterop: true,
      }
    }]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testTimeout: 30000,
} satisfies Config;
