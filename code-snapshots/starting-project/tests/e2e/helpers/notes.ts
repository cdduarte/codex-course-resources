import { expect, type Page } from "@playwright/test";

export type NoteInput = {
  title: string;
  body: string;
};

export async function createNoteViaUI(page: Page, input: NoteInput): Promise<string> {
  await page.goto("/notes/new");
  await page.getByLabel("Title").fill(input.title);

  const editor = page.locator(".ProseMirror").first();
  await editor.click();
  await editor.fill(input.body);

  await page.getByRole("button", { name: "Submit" }).click();
  await expect(page).toHaveURL(/\/notes\/[0-9a-f-]+$/);

  return page.url();
}

export async function updateNoteViaUI(page: Page, input: NoteInput): Promise<void> {
  const titleInput = page.locator("#edit-note-title");
  await titleInput.fill(input.title);

  const editor = page.locator(".ProseMirror").first();
  await editor.click();
  await editor.fill(input.body);

  await expect(page.getByText("Unsaved changes")).toBeVisible();
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Saved")).toBeVisible();
}
