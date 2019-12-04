module.exports = {
  rootDir: './build/__tests__/',
  testRegex: '.*\\.test.(ts|js)$',
  verbose: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
};
