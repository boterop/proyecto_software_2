import { spawn } from "node:child_process";
import process from "node:process";

let backend;

export default async function setup() {
  backend = spawn(
    "./mvnw",
    ["spring-boot:run", "-Dspring-boot.run.profiles=test"],
    {
      cwd: "../backend",
      stdio: "inherit",
      env: {
        ...process.env,
        TEST_ENDPOINTS_ENABLED: "true",
      },
    },
  );

  await waitForBackend("http://localhost:8080");

  return () => {
    backend.kill();
  };
}

async function waitForBackend(url) {
  const timeout = 30000;
  const start = Date.now();

  while (Date.now() - start < timeout) {
    try {
      const response = await fetch(url);

      if (response.ok || response.status < 500) {
        return;
      }
    } catch {
      // Backend todavía no está listo.
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  backend.kill();

  throw new Error("Backend did not start within 30 seconds");
}
