import { describe, expect, it } from "vitest";
import { lienComparaison, lireChoix, lireComparaison, meilleuresValeurs, suggerer, valeurChoix } from "@/lib/comparaison";

describe("lireChoix (ch. 9 — l'adresse est non fiable)", () => {
  it("nom de l'API gardé tel quel", () => {
    expect(lireChoix("pikachu")).toEqual({ etat: "nom", nom: "pikachu" });
  });

  it("majuscules et espaces ignorés, comme la fiche", () => {
    expect(lireChoix("  RaiChu ")).toEqual({ etat: "nom", nom: "raichu" });
  });

  it("noms à tiret ou chiffre acceptés : mr-mime, porygon-z", () => {
    expect(lireChoix("mr-mime")).toEqual({ etat: "nom", nom: "mr-mime" });
    expect(lireChoix("porygon-z")).toEqual({ etat: "nom", nom: "porygon-z" });
  });

  it("absent ou vide → vide", () => {
    for (const valeur of [undefined, "", "   ", []]) {
      expect(lireChoix(valeur)).toEqual({ etat: "vide" });
    }
  });

  it("caractères impossibles → invalide, sans requête : chemin, accents, espaces", () => {
    for (const saisi of ["../type/fire", "pikachu?x=1", "salamèche", "mr mime", "a".repeat(41)]) {
      expect(lireChoix(saisi)).toEqual({ etat: "invalide", saisi });
    }
  });

  it("paramètre répété (?b=raichu&b=mew) → le premier", () => {
    expect(lireChoix(["raichu", "mew"])).toEqual({ etat: "nom", nom: "raichu" });
  });
});

describe("lireComparaison", () => {
  it("a seul → b vide", () => {
    expect(lireComparaison({ a: "pikachu" })).toEqual({ a: { etat: "nom", nom: "pikachu" }, b: { etat: "vide" } });
  });
});

describe("meilleuresValeurs", () => {
  const stat = (nom: string, valeur: number) => ({ nom, valeur });

  it("le plus grand gagne, égalité signalée", () => {
    const a = [stat("hp", 35), stat("attack", 55), stat("speed", 90)];
    const b = [stat("hp", 60), stat("attack", 55), stat("speed", 110)];
    expect(meilleuresValeurs(a, b)).toEqual({ hp: "b", attack: "egalite", speed: "b" });
  });

  it("associe par nom, pas par position", () => {
    expect(meilleuresValeurs([stat("hp", 10), stat("speed", 99)], [stat("speed", 5), stat("hp", 20)])).toEqual({
      hp: "b",
      speed: "a",
    });
  });

  it("stat absente d'un côté → ignorée", () => {
    expect(meilleuresValeurs([stat("hp", 10)], [])).toEqual({});
  });
});

describe("suggerer (Q-C1)", () => {
  const noms = ["pikachu", "raichu", "raticate", "raichu-alola", "rattata"];

  it("noms qui contiennent la saisie, dans l'ordre de la liste", () => {
    expect(suggerer("rai", noms)).toEqual(["raichu", "raichu-alola"]);
    expect(suggerer("chu", noms)).toEqual(["pikachu", "raichu", "raichu-alola"]);
  });

  it("insensible à la casse et aux espaces autour", () => {
    expect(suggerer("  RAI ", noms)).toEqual(["raichu", "raichu-alola"]);
  });

  it("limité à 8 par défaut, ou à la limite donnée", () => {
    const beaucoup = Array.from({ length: 20 }, (_, i) => `nom-${i}`);
    expect(suggerer("nom", beaucoup)).toEqual(beaucoup.slice(0, 8));
    expect(suggerer("nom", beaucoup, 3)).toEqual(["nom-0", "nom-1", "nom-2"]);
  });

  it("saisie vide → aucune suggestion (pas toute la liste)", () => {
    expect(suggerer("", noms)).toEqual([]);
    expect(suggerer("   ", noms)).toEqual([]);
  });

  it("aucun résultat → liste vide", () => {
    expect(suggerer("zzz", noms)).toEqual([]);
    expect(suggerer("../type/fire", noms)).toEqual([]);
  });
});

describe("lienComparaison et valeurChoix", () => {
  it("remplace b, conserve a", () => {
    expect(lienComparaison("b", "raichu", "pikachu")).toBe("/comparer?a=pikachu&b=raichu");
  });

  it("remplace a, conserve b, toujours dans l'ordre a puis b", () => {
    expect(lienComparaison("a", "pikachu", "raichu")).toBe("/comparer?a=pikachu&b=raichu");
  });

  it("autre côté vide → un seul paramètre ; saisie invalide recopiée encodée", () => {
    expect(lienComparaison("a", "pikachu", null)).toBe("/comparer?a=pikachu");
    expect(lienComparaison("a", "pikachu", "../x")).toBe("/comparer?a=pikachu&b=..%2Fx");
  });

  it("valeurChoix : nom, saisie invalide, ou rien", () => {
    expect(valeurChoix({ etat: "nom", nom: "mew" })).toBe("mew");
    expect(valeurChoix({ etat: "invalide", saisi: "a b" })).toBe("a b");
    expect(valeurChoix({ etat: "vide" })).toBeNull();
  });
});
