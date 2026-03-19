import { expect, test } from "@playwright/test";
import { seedSharedNoteFixture } from "./helpers/db";

test("shows custom 404 for invalid share token", async ({ page }) => {
  await page.goto("/s/does-not-exist");
  await expect(page.getByRole("heading", { name: "Page Not Found" })).toBeVisible();
});

test("renders shared note page for a valid enabled share token", async ({ page }) => {
  const seededNote = seedSharedNoteFixture();

  await page.goto(`/s/${seededNote.token}`);

  await expect(page.getByRole("heading", { name: "Shared Note View Scaffold" })).toBeVisible();
  await expect(page.getByText(seededNote.title)).toBeVisible();
});
