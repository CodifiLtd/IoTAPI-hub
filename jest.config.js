export default {
  moduleFileExtensions: ['ts', 'js', 'json', 'node', 'mts'],
  preset: 'ts-jest',
  testMatch: ['**/tests/**/*.test.ts'],
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  transformIgnorePatterns: []
  // ...no transform, rely on preset
};
