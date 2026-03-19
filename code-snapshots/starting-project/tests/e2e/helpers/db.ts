import { createHash, randomUUID } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { E2E_DB_PATH } from "./test-env";

type SeededSharedNote = {
  token: string;
  title: string;
  noteId: string;
};

const SEEDED_NOTE_CONTENT_JSON = JSON.stringify({
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text: "Shared fixture content" }],
    },
  ],
});

export function seedSharedNoteFixture(title = "Shared fixture note"): SeededSharedNote {
  const now = new Date().toISOString();
  const userId = randomUUID();
  const noteId = randomUUID();
  const shareId = randomUUID();
  const token = `share-${randomUUID()}`;
  const tokenHash = createHash("sha256").update(token, "utf8").digest("hex");

  const db = new DatabaseSync(E2E_DB_PATH);

  try {
    db.exec("PRAGMA foreign_keys = ON;");

    db.prepare(
      `
      INSERT INTO "user" (id, name, email, emailVerified, image, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?);
      `,
    ).run(userId, "Shared Fixture User", `shared-${randomUUID()}@example.com`, 1, null, now, now);

    db.prepare(
      `
      INSERT INTO note (id, user_id, title, content_json, share_enabled, created_at, updated_at)
      VALUES (?, ?, ?, ?, 1, ?, ?);
      `,
    ).run(noteId, userId, title, SEEDED_NOTE_CONTENT_JSON, now, now);

    db.prepare(
      `
      INSERT INTO note_share (id, note_id, token_hash, enabled, created_at, disabled_at)
      VALUES (?, ?, ?, 1, ?, NULL);
      `,
    ).run(shareId, noteId, tokenHash, now);
  } finally {
    db.close();
  }

  return { token, title, noteId };
}
