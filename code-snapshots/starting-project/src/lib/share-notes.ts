import { createHash } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { Database } from "bun:sqlite";

const DEFAULT_DB_PATH = "./data/tinynotes.db";

const resolvedDbPath = path.resolve(process.cwd(), process.env.DB_PATH ?? DEFAULT_DB_PATH);
mkdirSync(path.dirname(resolvedDbPath), { recursive: true });

const globalForDb = globalThis as unknown as {
  tinynotesDb?: Database;
};

const db = globalForDb.tinynotesDb ?? new Database(resolvedDbPath, { create: true });
db.run("PRAGMA foreign_keys = ON;");

if (process.env.NODE_ENV !== "production") {
  globalForDb.tinynotesDb = db;
}

type SharedNoteRow = {
  id: string;
  title: string;
  content_json: string;
  updated_at: string;
};

export type SharedNoteRecord = {
  id: string;
  title: string;
  contentJson: string;
  updatedAt: string;
};

function hashShareToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function getPublicSharedNoteByToken(token: string): SharedNoteRecord | null {
  if (!token) {
    return null;
  }

  const tokenHash = hashShareToken(token);
  const row = db
    .query<SharedNoteRow, [string]>(
      `
        SELECT n.id, n.title, n.content_json, n.updated_at
        FROM note_share s
        JOIN note n ON n.id = s.note_id
        WHERE s.token_hash = ?
          AND s.enabled = 1
          AND n.share_enabled = 1
        LIMIT 1;
      `,
    )
    .get(tokenHash);

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    title: row.title,
    contentJson: row.content_json,
    updatedAt: row.updated_at,
  };
}
