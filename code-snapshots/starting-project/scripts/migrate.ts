import { Database } from "bun:sqlite";
import { existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

type Direction = "up" | "down";

type MigrationPair = {
  version: string;
  upPath: string;
  downPath: string;
  upSql: string;
  downSql: string;
};

const MIGRATIONS_DIR = path.resolve(process.cwd(), "migrations");
const DEFAULT_DB_PATH = "./data/tinynotes.db";

function ensureSchemaMigrationsTable(db: Database): void {
  db.run(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL
    );
  `);
}

function resolveDirection(rawDirection?: string): Direction {
  if (rawDirection === "up" || rawDirection === "down") {
    return rawDirection;
  }

  throw new Error("Usage: bun scripts/migrate.ts <up|down>");
}

function loadMigrationPairs(): MigrationPair[] {
  if (!existsSync(MIGRATIONS_DIR)) {
    throw new Error(`Migrations directory not found: ${MIGRATIONS_DIR}`);
  }

  const fileNames = readdirSync(MIGRATIONS_DIR).sort();
  const byVersion = new Map<
    string,
    { upPath?: string; downPath?: string; upSql?: string; downSql?: string }
  >();

  for (const fileName of fileNames) {
    const match = /^([0-9]{4}_[a-z0-9_-]+)\.(up|down)\.sql$/i.exec(fileName);
    if (!match) {
      continue;
    }

    const version = match[1];
    const type = match[2].toLowerCase() as "up" | "down";
    const fullPath = path.join(MIGRATIONS_DIR, fileName);
    const sql = readFileSync(fullPath, "utf8").trim();

    if (!sql) {
      throw new Error(`Migration file is empty: ${fileName}`);
    }

    const entry = byVersion.get(version) ?? {};
    if (type === "up") {
      if (entry.upPath) {
        throw new Error(`Duplicate up migration for version ${version}`);
      }
      entry.upPath = fullPath;
      entry.upSql = sql;
    } else {
      if (entry.downPath) {
        throw new Error(`Duplicate down migration for version ${version}`);
      }
      entry.downPath = fullPath;
      entry.downSql = sql;
    }

    byVersion.set(version, entry);
  }

  if (byVersion.size === 0) {
    throw new Error(`No migration files found in ${MIGRATIONS_DIR}`);
  }

  const pairs: MigrationPair[] = [];
  for (const version of [...byVersion.keys()].sort()) {
    const entry = byVersion.get(version);
    if (!entry?.upPath || !entry.upSql || !entry.downPath || !entry.downSql) {
      throw new Error(`Missing up/down pair for migration version ${version}`);
    }

    pairs.push({
      version,
      upPath: entry.upPath,
      downPath: entry.downPath,
      upSql: entry.upSql,
      downSql: entry.downSql,
    });
  }

  return pairs;
}

function openDatabase(): Database {
  const inputPath = process.env.DB_PATH ?? DEFAULT_DB_PATH;
  const dbPath = path.resolve(process.cwd(), inputPath);
  mkdirSync(path.dirname(dbPath), { recursive: true });

  const db = new Database(dbPath, { create: true });
  db.run("PRAGMA foreign_keys = ON;");
  return db;
}

function runUp(db: Database, migrations: MigrationPair[]): void {
  const appliedRows = db
    .query<{ version: string }, []>("SELECT version FROM schema_migrations;")
    .all();
  const appliedSet = new Set(appliedRows.map((row) => row.version));
  const knownSet = new Set(migrations.map((migration) => migration.version));

  for (const applied of appliedSet) {
    if (!knownSet.has(applied)) {
      throw new Error(
        `Inconsistent migration state: applied version "${applied}" has no migration files`,
      );
    }
  }

  const insertApplied = db.prepare<unknown, [string, string]>(
    "INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?);",
  );
  const applyMigration = db.transaction((version: string, sql: string) => {
    db.run(sql);
    insertApplied.run(version, new Date().toISOString());
  });

  let appliedCount = 0;
  for (const migration of migrations) {
    if (appliedSet.has(migration.version)) {
      continue;
    }

    applyMigration(migration.version, migration.upSql);
    appliedCount += 1;
    console.log(`Applied ${migration.version}`);
  }

  if (appliedCount === 0) {
    console.log("No pending migrations.");
    return;
  }

  console.log(`Applied ${appliedCount} migration(s).`);
}

function runDown(db: Database, migrations: MigrationPair[]): void {
  const latestApplied = db
    .query<{ version: string }, []>(
      `
      SELECT version
      FROM schema_migrations
      ORDER BY applied_at DESC, version DESC
      LIMIT 1;
      `,
    )
    .get();

  if (!latestApplied) {
    console.log("No applied migrations to roll back.");
    return;
  }

  const migration = migrations.find((candidate) => candidate.version === latestApplied.version);
  if (!migration) {
    throw new Error(
      `Inconsistent migration state: applied version "${latestApplied.version}" has no migration files`,
    );
  }

  const removeApplied = db.prepare<unknown, [string]>(
    "DELETE FROM schema_migrations WHERE version = ?;",
  );
  const rollbackMigration = db.transaction((version: string, sql: string) => {
    db.run(sql);
    removeApplied.run(version);
  });

  rollbackMigration(migration.version, migration.downSql);
  console.log(`Rolled back ${migration.version}`);
}

function main(): number {
  let db: Database | undefined;

  try {
    const direction = resolveDirection(process.argv[2]);
    const migrations = loadMigrationPairs();

    db = openDatabase();
    ensureSchemaMigrationsTable(db);

    if (direction === "up") {
      runUp(db, migrations);
    } else {
      runDown(db, migrations);
    }

    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Migration failed: ${message}`);
    return 1;
  } finally {
    db?.close(false);
  }
}

process.exit(main());
