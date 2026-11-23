import { describe, expect, it } from "vitest";
import { normaliser } from "@/lib/texte";

describe("normaliser", () => {
  it("donne la même valeur pour « Salamèche », « salameche » et « SALAMECHE  »", () => {
    const attendu = normaliser("Salamèche");
    expect(normaliser("salameche")).toBe(attendu);
    expect(normaliser("SALAMECHE  ")).toBe(attendu);
    expect(attendu).toBe("salameche");
  });

  it("transforme « Évoli » en « evoli »", () => {
    expect(normaliser("Évoli")).toBe("evoli");
  });

  it("laisse la chaîne vide vide", () => {
    expect(normaliser("")).toBe("");
  });
});
