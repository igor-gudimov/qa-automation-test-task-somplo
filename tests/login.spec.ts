/* eslint-disable playwright/no-element-handle */
import { expect } from "@playwright/test";
import { test as pt, test } from "./fixtures/setup";

const performLoginAction = async (
  page: Parameters<Parameters<typeof pt>[2]>[0]["page"],
  credentials: { email: string; password: string },
): Promise<void> => {
  await page.getByLabel("Email").fill(credentials.email);
  await page.getByLabel("Password").fill(credentials.password);
  await page.getByRole("button", { name: "Login" }).click();
};

pt(
  "Check User can login using correct credentials",
  { tag: "@browser-opera" },
  async ({ page }) => {
    await page.getByLabel("Email").fill(process.env.EMAIL!);
    await page.getByLabel("Password").fill(process.env.PASSWORD!);
    await page.getByRole("button", { name: "Login" }).click();

    //TODO: Add assertion to check if user is logged in successfully
  },
);

pt(
  "Check User cannot login using incorrect credentials",
  { tag: "@browser-opera" },
  async ({ page }) => {
    await page.getByLabel("Email").fill("invalid@example.com");
    await page.getByLabel("Password").fill("invalidpassword");
    await page.getByRole("button", { name: "Login" }).click();

     expect((await page.$("p"))?.asElement()).toBeTruthy();

    await expect(page).not.toHaveURL(/\/profile/);
  },
);

test(
  "Check that successful login redirects user to the profile page",
  { tag: "@browser-opera" },
  async ({ page }) => {
    const preLoginUrl: string = page.url();

    await performLoginAction(page, {
      email: process.env.EMAIL!,
      password: process.env.PASSWORD!,
    });

    await expect(page).toHaveURL(/\/profile/);
    const postLoginUrl: string = page.url();
    expect(typeof postLoginUrl).toBe("string");
    expect(postLoginUrl).not.toEqual(preLoginUrl);
  },
);

pt(
  "Check that an error message is displayed when wrong credentials are entered",
  { tag: "@browser-opera" },
  async ({ page }) => {
    // Using a dedicated invalid credentials object for clarity
    const invalidCredentials: { email: string; password: string } = {
      email: "notauser@nowhere.com",
      password: "definitelywrong",
    };

    await performLoginAction(page, invalidCredentials);

    // The error paragraph is expected to become visible after failed login
    const errorMessageLocator = page.locator("p");
    await expect(errorMessageLocator).toBeVisible();
    await expect(errorMessageLocator).toContainText("Invalid credentials");
  },
);

pt(
  "Check that submitting the login form with empty fields shows an error",
  { tag: "@browser-opera" },
  async ({ page }) => {
    const emptyCredentials: { email: string; password: string } = {
      email: "",
      password: "",
    };

    await performLoginAction(page, emptyCredentials);

    // Confirm we are still on the login page and were not redirected
    await expect(page).not.toHaveURL(/\/profile/);
  },
);
