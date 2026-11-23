import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Q-3 / research R13 — tests ciblés sur les fonctions pures ; même alias @/ que tsconfig.json.
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  test: {
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", ".next/**", ".claude/**", ".specify/**"],
  },
});
