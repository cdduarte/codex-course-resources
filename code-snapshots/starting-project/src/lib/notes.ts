import { mkdirSync } from "node:fs";
import path from "node:path";
import { Database } from "bun:sqlite";

const DEFAULT_DB_PATH = "./data/tinynotes.db";
const MAX_CONTENT_JSON_BYTES = 256 * 1024;

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

type NoteListRow = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

type NoteRow = {
  id: string;
  user_id: string;
  title: string;
  content_json: string;
  share_enabled: number;
  created_at: string;
  updated_at: string;
};

export type NoteListItem = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type NoteRecord = {
  id: string;
  userId: string;
  title: string;
  contentJson: string;
  shareEnabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UpdateUserNoteInput = {
  id: string;
  userId: string;
  title?: string;
  contentJson?: unknown;
};

export class NotesValidationError extends Error {
  constructor(message = "Invalid note payload") {
    super(message);
    this.name = "NotesValidationError";
  }
}

function mapNoteRow(row: NoteRow): NoteRecord {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    contentJson: row.content_json,
    shareEnabled: Boolean(row.share_enabled),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function normalizeTitle(title?: string): string {
  return title?.trim() ?? "";
}

function validateAndSerializeContentJson(contentJson: unknown): string {
  const parsedContent =
    typeof contentJson === "string" ? parseJsonContentString(contentJson) : contentJson;

  if (!parsedContent || typeof parsedContent !== "object" || Array.isArray(parsedContent)) {
    throw new NotesValidationError();
  }

  const serialized = JSON.stringify(parsedContent);
  if (Buffer.byteLength(serialized, "utf8") > MAX_CONTENT_JSON_BYTES) {
    throw new NotesValidationError();
  }

  return serialized;
}

function parseJsonContentString(contentJson: string): unknown {
  try {
    return JSON.parse(contentJson);
  } catch {
    throw new NotesValidationError();
  }
}

export function listUserNotes(userId: string): NoteListItem[] {
  const rows = db
    .query<NoteListRow, [string]>(
      `
        SELECT id, title, created_at, updated_at
        FROM note
        WHERE user_id = ?
        ORDER BY updated_at DESC;
      `,
    )
    .all(userId);

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export function getUserNoteById(noteId: string, userId: string): NoteRecord | null {
  const row = db
    .query<NoteRow, [string, string]>(
      `
        SELECT id, user_id, title, content_json, share_enabled, created_at, updated_at
        FROM note
        WHERE id = ? AND user_id = ?
        LIMIT 1;
      `,
    )
    .get(noteId, userId);

  return row ? mapNoteRow(row) : null;
}

export function createUserNote(input: {
  userId: string;
  title?: string;
  contentJson: unknown;
}): NoteRecord {
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const title = normalizeTitle(input.title);
  const serializedContentJson = validateAndSerializeContentJson(input.contentJson);

  db.query<unknown, [string, string, string, string, string, string]>(
    `
      INSERT INTO note (id, user_id, title, content_json, share_enabled, created_at, updated_at)
      VALUES (?, ?, ?, ?, 0, ?, ?);
    `,
  ).run(id, input.userId, title, serializedContentJson, now, now);

  return {
    id,
    userId: input.userId,
    title,
    contentJson: serializedContentJson,
    shareEnabled: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function updateUserNote(input: UpdateUserNoteInput): NoteRecord | null {
  if (input.title === undefined && input.contentJson === undefined) {
    throw new NotesValidationError();
  }

  const now = new Date().toISOString();
  const normalizedTitle = input.title === undefined ? null : normalizeTitle(input.title);
  const serializedContentJson =
    input.contentJson === undefined ? null : validateAndSerializeContentJson(input.contentJson);

  const result = db
    .query<unknown, [string | null, string | null, string, string, string]>(
      `
        UPDATE note
        SET title = COALESCE(?, title),
            content_json = COALESCE(?, content_json),
            updated_at = ?
        WHERE id = ? AND user_id = ?;
      `,
    )
    .run(normalizedTitle, serializedContentJson, now, input.id, input.userId);

  if (result.changes === 0) {
    return null;
  }

  return getUserNoteById(input.id, input.userId);
}
