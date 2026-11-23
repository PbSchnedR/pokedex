import { describe, expect, it } from "vitest";
import { bornerPage, lireFiltres } from "@/lib/parametres";

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
