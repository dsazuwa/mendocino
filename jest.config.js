/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  collectCoverage: true,
  coverageReporters: ["cobertura", "text"],
  reporters: ["default", "jest-junit"],
};