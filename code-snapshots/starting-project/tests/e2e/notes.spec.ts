import { expect, test } from "@playwright/test";
import { createUserCredentials, loginViaUI, logoutViaUI, registerViaUI } from "./helpers/auth";
import { createNoteViaUI, updateNoteViaUI } from "./helpers/notes";

test("creates and edits a note with persisted content", async ({ page }) => {
  const user = createUserCredentials("notes-owner");
  await registerViaUI(page, user);

  const createdTitle = `Created note ${Date.now()}`;
  const createdBody = "Initial note body";
  const noteUrl = await createNoteViaUI(page, {
    title: createdTitle,
    body: createdBody,
  });

  await expect(page.locator("#edit-note-title")).toHaveValue(createdTitle);
  await expect(page.locator(".ProseMirror").first()).toContainText(createdBody);

  const updatedTitle = `${createdTitle} updated`;
  const updatedBody = "Updated note content";
  await updateNoteViaUI(page, {
    title: updatedTitle,
    body: updatedBody,
  });

  await page.reload();
  await expect(page.locator("#edit-note-title")).toHaveValue(updatedTitle);
  await expect(page.locator(".ProseMirror").first()).toContainText(updatedBody);

  await page.goto("/notes");
  await expect(page.getByText(updatedTitle)).toBeVisible();

  await page.goto(noteUrl);
  await expect(page.locator("#edit-note-title")).toHaveValue(updatedTitle);
});

test("shows a generic error for invalid login credentials", async ({ page }) => {
  const user = createUserCredentials("login-error");
  await registerViaUI(page, user);
  await logoutViaUI(page);

  await loginViaUI(page, {
    email: user.email,
    password: `${user.password}-wrong`,
  });

  await expect(
    page.getByText("We couldn't complete that request. Please try again."),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});

test("does not allow one user to view another user's note", async ({ page }) => {
  const owner = createUserCredentials("owner");
  await registerViaUI(page, owner);

  const ownerNoteUrl = await createNoteViaUI(page, {
    title: "Owner private note",
    body: "Only owner should access this note.",
  });

  await logoutViaUI(page);

  const otherUser = createUserCredentials("other");
  await registerViaUI(page, otherUser);

  await page.goto(ownerNoteUrl);
  await expect(page.getByRole("heading", { name: "Page Not Found" })).toBeVisible();
});
