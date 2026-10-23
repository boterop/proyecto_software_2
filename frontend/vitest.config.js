import { defineConfig, mergeConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import viteConfig from "./vite.config.js";

// https://vitejs.dev/config/
export default mergeConfig(
  viteConfig,
  defineConfig({
    plugins: [react()],
    test: {
      environment: "jsdom",
      setupFiles: ["./test/setup.js"],
      coverage: {
        provider: "v8",
        reporter: ["text", "lcov"],
        thresholds: {
          lines: 70,
        },
      },
      globals: true,
      globalSetup: "./test/globalSetup.js",
    },
  }),
);
