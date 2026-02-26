import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Include .ts test files
    include: ["src/**/*.test.ts", "tests/**/*.test.ts"],
    environment: "node",
  },
});
