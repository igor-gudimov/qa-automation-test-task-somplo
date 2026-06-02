import { test as baseTest } from "@playwright/test";
import { LoginPage } from "../../src/pages/loginPage";
import { ProfilePage } from "../../src/pages/profilePage";

type Pages = {
  loginPage: LoginPage;
  profilePage: ProfilePage;
};

export const test = baseTest.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await page.goto(`/`);
    await use(new LoginPage(page));
  },
  profilePage: async ({ page }, use) => {
    await page.goto(`/profile`);
    await use(new ProfilePage(page));
  }
});
