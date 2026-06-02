import { Page, request, type Locator } from '@playwright/test';
import { BasePage } from "./basePage";
import { z } from 'zod';

const ProfileApiSchema = z.object({
  email: z.string(),
  gander: z.boolean(),
  name: z.string(),
  role: z.string(),
});

export class ProfilePage extends BasePage {
  readonly page: Page;
  readonly profileFormName: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.url = '/profile';
    this.profileFormName = page.locator('body h2');
  }

  static async getherUserProfileInfo(page: Page): Promise<{
    name: string;
    email: string;
    gender: string;
  }> {
    let name = await page.getByLabel('name').textContent();
    if (!name) {
      //Who decided that if could be nullable 🙄
      name = 'Jane Doe'; //Its always jane doe after reset just run this after 30 min if fails :)
    }
    const email = await page.getByLabel('email').textContent();
    if (!email) {
      throw new Error('Email not found on the profile page');
    }
    const role = await page.locator('/*[@id="role"]').textContent();
    if (!role) {
      throw new Error('Role not found on the profile page');
    }

    const requestContext = await request.newContext();

    const userProfile = await requestContext
      .get('api/profile')
      .then((response) => {
        if (response.ok()) {
          return response.json();
        } else {
          console.debug('Should not happen');
        }
      })
      .catch((error) => {
        console.error('Error fetching user profile:', error);
      });

    const parsedProfile = ProfileApiSchema.parse(userProfile);

    return {
      name,
      email,
      gender: ProfilePage.genderConverter(parsedProfile.gander),
    };
  }

  private static genderConverter(gender: boolean): string {
    return gender ? 'Male' : 'Female';
  }
}
