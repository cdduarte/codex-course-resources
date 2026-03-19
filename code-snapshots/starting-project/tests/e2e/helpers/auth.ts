import { expect, type Page } from "@playwright/test";

export type AuthUser = {
  name: string;
  email: string;
  password: string;
};

function uniqueSuffix(label: string): string {
  return `${label}-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

export function createUserCredentials(label: string): AuthUser {
  const suffix = uniqueSuffix(label);
  return {
    name: `User ${suffix}`,
    email: `${suffix}@example.com`,
    password: `Password!${suffix}`,
  };
}

export async function registerViaUI(page: Page, user: AuthUser): Promise<void> {
  await page.goto("/register");
  await page.getByLabel("Name").fill(user.name);
  await page.getByLabel("Email").fill(user.email);
  await page.getByLabel("Password").fill(user.password);
  await page.getByRole("button", { name: "Create Account" }).click();
  await expect(page).toHaveURL(/\/notes$/);
}

export async function loginViaUI(
  page: Page,
  credentials: Pick<AuthUser, "email" | "password">,
): Promise<void> {
  await page.goto("/login");
  await page.getByLabel("Email").fill(credentials.email);
  await page.getByLabel("Password").fill(credentials.password);
  await page.getByRole("button", { name: "Sign In" }).click();
}

export async function logoutViaUI(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Logout" }).click();
  await expect(page).toHaveURL(/\/login$/);
}
