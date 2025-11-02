module.exports = {
  testEnvironment: "node",
  testTimeout: 30000,
  transform: {},
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.cjs"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/server.js",
    "!src/app.js",
    "!src/config/db.js",
    "!src/config/googleAuth.js",
    "!src/routes/authRoutes.js",
    "!src/controllers/albumController.js",
    "!src/models/Album.js",
    "!src/routes/albumRoutes.js"
  ],
  coverageDirectory: "<rootDir>/coverage",
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 80,
      statements: 80
    }
  }
};