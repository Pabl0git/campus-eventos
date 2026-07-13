module.exports = {
  testEnvironment: "jsdom",
  transform: { "^.+\\.[jt]sx?$": "babel-jest" },
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.js"],
  moduleNameMapper: { "\\.(css)$": "<rootDir>/src/test/styleMock.js" },
};
