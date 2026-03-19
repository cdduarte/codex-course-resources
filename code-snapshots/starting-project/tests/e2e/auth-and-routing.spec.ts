import { expect, test } from "@playwright/test";
import { createUserCredentials, registerViaUI } from "./helpers/auth";

test("redirects unauthenticated users to login", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/login$/);

  await page.goto("/notes");
  await expect(page).toHaveURL(/\/login$/);
});

test("registers a new account and lands in notes", async ({ page }) => {
  const user = createUserCredentials("register");

  await registerViaUI(page, user);

  await expect(page.getByRole("heading", { name: "Your Notes" })).toBeVisible();
  await expect(page.getByText("No notes yet")).toBeVisible();
});
