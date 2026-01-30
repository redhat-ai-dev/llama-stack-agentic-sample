/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type {Config} from 'jest';

const config: Config = {
  // The glob patterns Jest uses to detect test files
  testMatch: [
    "**/tests/**/*.?([mc])[jt]s?(x)",
  ],
  testEnvironment: "node",
  preset: "ts-jest",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "ts-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!@kubernetes/client-node)/"
  ],
  testTimeout: 60000
};

export default config;
