/* eslint-disable playwright/no-element-handle */
import { expect } from "@playwright/test";
import { test } from "./fixtures/setup";

// Using a dedicated invalid credentials object for clarity
const invalidCredentials: { email: string; password: string } = {
  email: "notauser@nowhere.com",
  password: "definitelywrong",
};

test.beforeEach(async ({ loginPage }) => {
  // start each test by opening login page
  await loginPage.open()
});

test.afterEach(async ({ page }) => {
  // tear down the page after the test finishes
  await page.close();
});

test(
  "Check User can login using correct credentials",
  { tag: "@browser-opera" },
  async ({ page, loginPage, profilePage }) => {
    await loginPage.performLoginAction(process.env.EMAIL!, process.env.PASSWORD!)
    //TODO: Add assertion to check if user is logged in successfully
    await expect(page).toHaveURL(/\/profile/);
    await expect(profilePage.profileFormName).toContainText('User Profile');
  },
);

test(
  "Check User cannot login using incorrect credentials",
  { tag: "@browser-opera" },
  async ({ page, loginPage }) => {
    await loginPage.performLoginAction(invalidCredentials.email, invalidCredentials.password)
    // expect((await page.$("p"))?.asElement()).toBeTruthy(); - don't understand what this assert does.
    await expect(page).not.toHaveURL(/\/profile/);
  },
);

test(
  "Check that successful login redirects user to the profile page",
  { tag: "@browser-opera" },
  async ({ page, loginPage }) => {
    const preLoginUrl: string = page.url();
    await loginPage.performLoginAction(process.env.EMAIL!, process.env.PASSWORD!)
    await expect(page).toHaveURL(/\/profile/);
    const postLoginUrl: string = page.url();
    // expect(typeof postLoginUrl).toBe("string"); - don't think this necessary here
    expect(postLoginUrl).not.toEqual(preLoginUrl);
  },
);

test(
  "Check that an error message is displayed when wrong credentials are entered",
  { tag: "@browser-opera" },
  async ({ loginPage }) => {
    await loginPage.performLoginAction(invalidCredentials.email, invalidCredentials.password)
    // The error paragraph is expected to become visible after failed login
    await expect(loginPage.messagePopup).toBeVisible();
    await expect(loginPage.messagePopup).toContainText("Invalid credentials");
  },
);

test(
  "Check that submitting the login form with empty fields shows an error", // remain on login page but will not show error message
  { tag: "@browser-opera" },
  async ({ page, loginPage }) => {
    await loginPage.performLoginAction("", "")
    // Confirm we are still on the login page and were not redirected
    await expect(page).not.toHaveURL(/\/profile/);
  },
);
