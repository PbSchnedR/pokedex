import { describe, expect, it } from "vitest";
import { NOMS_FR, nomFrancais, nomFrancaisDepuisNom } from "@/lib/noms-fr";

describe("noms français", () => {
  it("couvre les 1 025 Pokémon, dans l'ordre des numéros", () => {
    expect(NOMS_FR).toHaveLength(1025);
    expect(NOMS_FR.every((p, i) => p.id === i + 1 && p.nomFr.length > 0)).toBe(true);
  });

  it("traduit par numéro, avec repli", () => {
    expect(nomFrancais(4)).toBe("Salamèche");
    expect(nomFrancais(133)).toBe("Évoli");
    expect(nomFrancais(9999, "missingno")).toBe("missingno");
  });

  it("traduit par nom API, avec repli sur ce nom", () => {
    expect(nomFrancaisDepuisNom("bulbasaur")).toBe("Bulbizarre");
    expect(nomFrancaisDepuisNom("deoxys-normal")).toBe("Deoxys");
    expect(nomFrancaisDepuisNom("inconnu")).toBe("inconnu");
  });
});
