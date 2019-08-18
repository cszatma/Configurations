module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.(js|ts)'],
  coveragePathIgnorePatterns: ['src/templates', '.d.ts'],
  coverageReporters: ['html', 'text', 'lcov'],
  modulePaths: ['<rootDir>/src', '<rootDir>'],
};
