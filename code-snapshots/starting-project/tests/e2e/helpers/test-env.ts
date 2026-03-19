import path from "node:path";

export const E2E_BASE_URL = "http://127.0.0.1:3000";
export const E2E_DB_PATH = path.resolve("/tmp", "tinynotes.e2e.db");
export const E2E_SERVER_PID_PATH = path.resolve("/tmp", "tinynotes.playwright.server.pid");
