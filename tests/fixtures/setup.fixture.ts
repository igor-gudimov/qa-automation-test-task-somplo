import { test as baseTest } from "@playwright/test";

const test = baseTest.extend({
  page: async ({ page }, use) => {
    await page.goto("/");
    await use(page);
  },
});

export { test };
