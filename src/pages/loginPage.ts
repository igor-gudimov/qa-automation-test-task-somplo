import { type Locator, type Page } from '@playwright/test';
import { BasePage } from "./basePage";

export class LoginPage extends BasePage {
  readonly page: Page;
  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;
  readonly messagePopup: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.url = '/';
    this.emailField = page.getByLabel("Email");
    this.passwordField = page.getByLabel("Password");
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.messagePopup = page.locator("#message")
  }

  async performLoginAction(email: string, password: string) {
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await this.loginButton.click();
  }
}