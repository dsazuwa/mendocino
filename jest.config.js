/* eslint-disable @typescript-eslint/no-var-requires */
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  collectCoverage: true,
  coverageReporters: ['cobertura', 'text'],
  reporters: ['default', 'jest-junit'],

  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  modulePaths: [compilerOptions.baseUrl],
};
