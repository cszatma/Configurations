module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/tests/**/*.test.(ts|js)'],
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.(js|ts)'],
};
