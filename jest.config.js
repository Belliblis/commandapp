/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset:'ts-jest',
  testEnvironment: "node",
  roots:["<rootDir>/src/__test__"], 
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    "^.+\.ts?$": "ts-jest",
  },
  testRegex: "(/__test__/.*|(\\.|/)(test|spec))\\.ts$",
  collectCoverage: true
};