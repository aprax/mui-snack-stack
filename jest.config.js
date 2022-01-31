module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  coveragePathIgnorePatterns: ["/node_modules/", "/dist"],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
