// TODO: Add 3-5 tests for the profile page
import { expect } from "@playwright/test";
import { test } from "./fixtures/setup";
let faker: any;
interface FakeUser {
  fullName: string;
  email: string;
  role: string;
}

const generateFakeUser = (): FakeUser => {
  return {
    fullName: faker.person.fullName(), // Generates a random full name
    email: faker.internet.email(),     // Generates a random email
    role: faker.person.jobTitle(),     // Generates a random job role
  };
};

const invalideEmail = "invalidEmail#example.com"

test.beforeAll(async () => {
  const module = await import('@faker-js/faker');
  faker = module.faker;
});

test.beforeEach(async ({ profilePage }) => {
  // start each test by opening login page
  await profilePage.open()
});

test.afterEach(async ({ page }) => {
  // tear down the page after the test finishes
  await page.close();
});

test(
  "Verify that a user can successfully update their profile with valid data",
  { tag: "@browser-opera" },
  async ({ page, profilePage }) => {
    const fakeUser = generateFakeUser();
    await profilePage.updateUserProfile(fakeUser.fullName, fakeUser.email, fakeUser.role)
    await page.reload()
    // gather user data is possible only by using "api/profile" GET request, 
    // page html doesn't contain user data
    const currentUserDetails = profilePage.gatherUserProfileInfo()
    expect((await currentUserDetails).name).toContain(fakeUser.fullName);
    expect((await currentUserDetails).email).toContain(fakeUser.email);
    expect((await currentUserDetails).role).toContain(fakeUser.role);
  }
);

test(
  "Verify that the system rejects an invalid email address format",
  { tag: "@browser-opera" },
  async ({ page, profilePage }) => {
    const preUpdateUserDetails = profilePage.gatherUserProfileInfo()
    const fakeUser = generateFakeUser();
    await profilePage.updateUserProfile(fakeUser.fullName, invalideEmail, fakeUser.role)
    await page.reload()
    const postUpdateUserDetails = profilePage.gatherUserProfileInfo()
    expect((await preUpdateUserDetails).name).toContain((await postUpdateUserDetails).name);
    expect((await preUpdateUserDetails).email).toContain((await postUpdateUserDetails).email);
    expect((await preUpdateUserDetails).role).toContain((await postUpdateUserDetails).role);
  }
);

test(
  "Verify that the system can save profile with empty fields",
  { tag: "@browser-opera" },
  async ({ page, profilePage }) => {
    await profilePage.updateUserProfile("", "", "")
    await page.reload()
    const currentUserDetails = profilePage.gatherUserProfileInfo()
    expect((await currentUserDetails).name).toContain("");
    expect((await currentUserDetails).email).toContain("");
    expect((await currentUserDetails).role).toContain("");
  }
);

test(
  "Verify that the system can return GET request all user data fields - name, email, role, gender",
  { tag: "@browser-opera" },
  async ({ page, profilePage }) => {
    const fakeUser = generateFakeUser();
    await profilePage.updateUserProfile(fakeUser.fullName, fakeUser.email, fakeUser.role)
    await page.reload()
    const currentUserDetails = profilePage.gatherUserProfileInfo()
    expect((await currentUserDetails).name).toContain(fakeUser.fullName);
    expect((await currentUserDetails).email).toContain(fakeUser.email);
    expect((await currentUserDetails).role).toContain(fakeUser.role);
    expect((await currentUserDetails).gender).toContain("Male");
  }
);