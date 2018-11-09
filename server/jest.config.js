module.exports = {
  displayName: 'test',
  rootDir: './',
  verbose: true,
  moduleFileExtensions: [
    'js',
  ],
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(js?|ts?)$',
};
