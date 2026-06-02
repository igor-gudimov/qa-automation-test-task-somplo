import { type Page } from '@playwright/test';

export abstract class BasePage {
    protected page: Page;
    protected url: string;
  
    constructor(page: Page) {
      this.page = page;
      this.url = '';
    }
  
    async open() {
      await this.page.goto(this.url);
    }
  
  }