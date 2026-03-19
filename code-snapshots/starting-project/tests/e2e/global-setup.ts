import { type ChildProcess, execFileSync, spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { E2E_BASE_URL, E2E_DB_PATH, E2E_SERVER_PID_PATH } from "./helpers/test-env";

function getServerEnvironment(): NodeJS.ProcessEnv {
  return {
    ...process.env,
    DB_PATH: E2E_DB_PATH,
    APP_URL: E2E_BASE_URL,
    BETTER_AUTH_URL: E2E_BASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET ?? "e2e-auth-secret-abcdefghijklmnopqrstuvwxyz-0123456789",
    BETTER_AUTH_SECRET:
      process.env.BETTER_AUTH_SECRET ??
      "e2e-better-auth-secret-abcdefghijklmnopqrstuvwxyz-0123456789",
    TMPDIR: "/tmp",
    TMP: "/tmp",
    TEMP: "/tmp",
  };
}

function clearStaleServerProcess(): void {
  if (!existsSync(E2E_SERVER_PID_PATH)) {
    return;
  }

  const pidValue = readFileSync(E2E_SERVER_PID_PATH, "utf8").trim();
  const pid = Number.parseInt(pidValue, 10);
  if (Number.isInteger(pid)) {
    try {
      process.kill(pid, "SIGTERM");
    } catch {
      // Process may already be gone.
    }
  }

  rmSync(E2E_SERVER_PID_PATH, { force: true });
}

async function waitForServerReady(timeoutMs = 120_000): Promise<void> {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(E2E_BASE_URL, { redirect: "manual" });
      if (response.status >= 200 && response.status < 500) {
        return;
      }
    } catch {
      // Retry until timeout.
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for dev server at ${E2E_BASE_URL}`);
}

export default async function globalSetup(): Promise<void> {
  clearStaleServerProcess();

  mkdirSync(path.dirname(E2E_DB_PATH), { recursive: true });

  if (existsSync(E2E_DB_PATH)) {
    rmSync(E2E_DB_PATH, { force: true });
  }

  execFileSync("bun", ["scripts/migrate.ts", "up"], {
    cwd: process.cwd(),
    env: getServerEnvironment(),
    stdio: "inherit",
  });

  const serverProcess: ChildProcess = spawn(
    "bun",
    ["run", "--bun", "next", "dev", "--hostname", "127.0.0.1", "--port", "3000"],
    {
      cwd: process.cwd(),
      env: getServerEnvironment(),
      detached: true,
      stdio: "ignore",
    },
  );

  serverProcess.unref();
  writeFileSync(E2E_SERVER_PID_PATH, `${serverProcess.pid}\n`, "utf8");

  await waitForServerReady();
}
