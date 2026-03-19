import { existsSync, readFileSync, rmSync } from "node:fs";
import { E2E_SERVER_PID_PATH } from "./helpers/test-env";

export default function globalTeardown(): void {
  if (!existsSync(E2E_SERVER_PID_PATH)) {
    return;
  }

  const pidValue = readFileSync(E2E_SERVER_PID_PATH, "utf8").trim();
  const pid = Number.parseInt(pidValue, 10);
  if (Number.isInteger(pid)) {
    try {
      process.kill(pid, "SIGTERM");
    } catch {
      // The process may have exited already.
    }
  }

  rmSync(E2E_SERVER_PID_PATH, { force: true });
}
