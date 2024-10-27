/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "node",
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  // ignore folder /fixtures
  testPathIgnorePatterns: [
    "/node_modules/",
    "/fixtures/"
  ],
};