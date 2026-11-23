import { describe, expect, it } from "vitest";
import { nomFrancais } from "@/lib/noms-fr";
import { verifierReponse } from "@/lib/quiz";

describe("verifierReponse (quiz des silhouettes)", () => {
  const salameche = nomFrancais(4, "charmander"); // « Salamèche »

  it("accepte « SALAMECHE » pour Salamèche (majuscules et accent ignorés)", () => {
    expect(verifierReponse("SALAMECHE", salameche)).toBe("juste");
  });

  it("ignore les accents dans les deux sens", () => {
    expect(verifierReponse("salamèche", salameche)).toBe("juste");
    expect(verifierReponse("evoli", nomFrancais(133))).toBe("juste");
    expect(verifierReponse("Évoli", "Evoli")).toBe("juste");
  });

  it("ignore les espaces en début et en fin", () => {
    expect(verifierReponse("  salameche \t", salameche)).toBe("juste");
  });

  it("refuse une réponse vide ou faite d'espaces", () => {
    expect(verifierReponse("", salameche)).toBe("vide");
    expect(verifierReponse("   ", salameche)).toBe("vide");
  });

  it("juge faux un autre nom, même proche", () => {
    expect(verifierReponse("Carapuce", salameche)).toBe("faux");
    expect(verifierReponse("salamech", salameche)).toBe("faux");
    expect(verifierReponse("charmander", salameche)).toBe("faux"); // nom anglais : non (Q3)
  });
});
