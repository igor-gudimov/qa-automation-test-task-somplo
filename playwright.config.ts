import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 0 : 1,
  workers: process.env.CI ? 28 : 1,
  reporter: [["html", { open: "always", outputFolder: "playwright-report" }]],
  use: {
    baseURL:
      "http://manualqatestapp-env.eba-m5fbuh33.us-east-1.elasticbeanstalk.com/",
    trace: "off",
  },
  projects: [
    {
      name: "opera",
      grep: [/@browser-opera/],
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
