import { describe, expect, it } from "vitest";
import { bornerPage, lireAdversaire, lireFiltres, lireTri } from "@/lib/parametres";

describe("lireFiltres (ch. 9 — l'adresse est non fiable)", () => {
  it("type connu gardé", () => {
    expect(lireFiltres({ type: "electric" }).type).toBe("electric");
  });

  it("type inventé ignoré : licorne", () => {
    expect(lireFiltres({ type: "licorne" }).type).toBe("");
  });

  it("clés héritées d'Object.prototype ignorées : constructor, toString, __proto__", () => {
    for (const type of ["constructor", "toString", "__proto__", "hasOwnProperty"]) {
      expect(lireFiltres({ type }).type).toBe("");
    }
  });

  it("q entouré d'espaces et en majuscules → texte nettoyé, q d'origine conservé", () => {
    expect(lireFiltres({ q: "  PIKA " })).toEqual({ q: "  PIKA ", texte: "pika", type: "" });
  });

  it("paramètres absents → valeurs vides", () => {
    expect(lireFiltres({})).toEqual({ q: "", texte: "", type: "" });
  });

  it("paramètre répété (?q=a&q=b) → le premier, sans planter", () => {
    expect(lireFiltres({ q: ["Pika", "mew"], type: ["fire", "water"] })).toEqual({ q: "Pika", texte: "pika", type: "fire" });
  });
});

describe("bornerPage (ch. 9 — Math.ceil et bornes)", () => {
  it("1 025 résultats → 43 pages", () => {
    expect(bornerPage("1", 1025)).toEqual({ pageCourante: 1, nombrePages: 43 });
  });

  it("page=abc → 1", () => {
    expect(bornerPage("abc", 1025).pageCourante).toBe(1);
  });

  it("page=9999 → dernière page", () => {
    expect(bornerPage("9999", 1025).pageCourante).toBe(43);
  });

  it("page=-3 → 1, page=0 → 1", () => {
    expect(bornerPage("-3", 1025).pageCourante).toBe(1);
    expect(bornerPage("0", 1025).pageCourante).toBe(1);
  });

  it("page=2.5 → 2 (pas de page décimale)", () => {
    expect(bornerPage("2.5", 1025).pageCourante).toBe(2);
  });

  it("aucun résultat → 1 page, page 1", () => {
    expect(bornerPage("5", 0)).toEqual({ pageCourante: 1, nombrePages: 1 });
  });

  it("42 résultats → 2 pages (exemple du cours)", () => {
    expect(bornerPage(undefined, 42).nombrePages).toBe(2);
  });
});

describe("lireAdversaire (bonus FR-039 — ?adversaire= est non fiable)", () => {
  it("liste valide → numéros dans l'ordre", () => {
    expect(lireAdversaire("25,6,94")).toEqual([25, 6, 94]);
  });

  it("un seul numéro, et les bornes 1 et 1 025 acceptées", () => {
    expect(lireAdversaire("1")).toEqual([1]);
    expect(lireAdversaire("1025,1")).toEqual([1025, 1]);
  });

  it("six numéros acceptés, sept refusés", () => {
    expect(lireAdversaire("1,2,3,4,5,6")).toEqual([1, 2, 3, 4, 5, 6]);
    expect(lireAdversaire("1,2,3,4,5,6,7")).toBeNull();
  });

  it("absent ou vide → null", () => {
    expect(lireAdversaire(undefined)).toBeNull();
    expect(lireAdversaire("")).toBeNull();
    expect(lireAdversaire([])).toBeNull();
  });

  it("hors bornes → null : 0, 1026, -3", () => {
    for (const valeur of ["0", "1026", "-3", "25,0"]) {
      expect(lireAdversaire(valeur)).toBeNull();
    }
  });

  it("pas un entier écrit en chiffres → null : abc, 2.5, 1e2, 0x10, espace, virgule en trop", () => {
    for (const valeur of ["abc", "2.5", "1e2", "0x10", " 7", "25, 6", "25,,6", "25,", "Infinity"]) {
      expect(lireAdversaire(valeur)).toBeNull();
    }
  });

  it("doublon → null", () => {
    expect(lireAdversaire("25,6,25")).toBeNull();
  });

  it("paramètre répété (?adversaire=a&adversaire=b) → le premier, sans planter", () => {
    expect(lireAdversaire(["25,6", "94"])).toEqual([25, 6]);
    expect(lireAdversaire(["abc", "94"])).toBeNull();
  });
});

describe("lireTri (bonus FR-036 — ?tri= est non fiable)", () => {
  it("nom et numero gardés", () => {
    expect(lireTri("nom")).toBe("nom");
    expect(lireTri("numero")).toBe("numero");
  });

  it("absent ou vide → numero (ordre du Pokédex)", () => {
    expect(lireTri(undefined)).toBe("numero");
    expect(lireTri("")).toBe("numero");
    expect(lireTri([])).toBe("numero");
  });

  it("valeur inventée → numero : licorne, NOM, ' nom', constructor", () => {
    for (const valeur of ["licorne", "NOM", " nom", "nom ", "constructor", "__proto__"]) {
      expect(lireTri(valeur)).toBe("numero");
    }
  });

  it("paramètre répété (?tri=a&tri=b) → le premier, sans planter", () => {
    expect(lireTri(["nom", "numero"])).toBe("nom");
    expect(lireTri(["licorne", "nom"])).toBe("numero");
  });
});
