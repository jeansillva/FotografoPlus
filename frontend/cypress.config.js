import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'a1nb1p',
  e2e: {
    baseUrl: "http://localhost:5173",
    supportFile: "cypress/support/e2e.js",
    setupNodeEvents(on, config) {
    },
  },
});
