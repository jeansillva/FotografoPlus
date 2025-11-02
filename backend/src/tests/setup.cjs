const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const noop = () => {};
console.log = noop;
console.error = noop;
console.warn = noop;

beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});
