import { mkdirSync } from "node:fs";
import path from "node:path";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Database } from "bun:sqlite";

const DEFAULT_DB_PATH = "./data/tinynotes.db";

const resolvedDbPath = path.resolve(process.cwd(), process.env.DB_PATH ?? DEFAULT_DB_PATH);
mkdirSync(path.dirname(resolvedDbPath), { recursive: true });

const globalForAuth = globalThis as unknown as {
  tinynotesAuthDb?: Database;
};

const authDb = globalForAuth.tinynotesAuthDb ?? new Database(resolvedDbPath, { create: true });
authDb.run("PRAGMA foreign_keys = ON;");

if (process.env.NODE_ENV !== "production") {
  globalForAuth.tinynotesAuthDb = authDb;
}

const baseURL = process.env.BETTER_AUTH_URL ?? process.env.APP_URL ?? "http://localhost:3000";

export const auth = betterAuth({
  database: authDb,
  baseURL,
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
});
