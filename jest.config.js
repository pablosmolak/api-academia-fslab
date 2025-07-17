export default {
  coverageDirectory: 'coverage',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: ['src/**/*.js'],
  coveragePathIgnorePatterns: [
    "/src/seed/",
    "/src/docs/",
  ],
  transform: {
    '^.+\\.js$': 'babel-jest', // Use babel-jest para transformar arquivos JS
  },
  testEnvironment: 'node'
};
