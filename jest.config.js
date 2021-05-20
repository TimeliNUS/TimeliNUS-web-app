module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  // we should collect coverage
  collectCoverage: true,
  // set a directory for coverage cache
  // coverageDirectory: '<rootDir>/tests/__coverage__',
  // set patterns to ignore for coverage
  coveragePathIgnorePatterns: ['/node_modules/']
};
