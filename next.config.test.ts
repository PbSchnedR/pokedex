import { describe, expect, it } from "vitest";
import nextConfig from "@/next.config";

// ch. 0 — « ne supprimez pas ces lignes, tout le chapitre 7 repose dessus ».
// Premier test (T006) : il vérifie aussi que l'alias @/ fonctionne sous Vitest.
describe("next.config.ts", () => {
  it("garde cacheComponents et partialPrefetching activés", () => {
    expect(nextConfig.cacheComponents).toBe(true);
    expect(nextConfig.partialPrefetching).toBe(true);
  });
});
