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
    for (const saisi of ["../type/fire", "pikachu?x=1", "salamèchu", "mr mime", "a".repeat(41)]) {
      expect(lireChoix(saisi)).toEqual({ etat: "invalide", saisi });
    }
  });

  it("bonus FR-033 : nom français → nom de l'API, accents, casse et espaces ignorés", () => {
    expect(lireChoix("Salamèche")).toEqual({ etat: "nom", nom: "charmander" });
    expect(lireChoix("  SALAMECHE ")).toEqual({ etat: "nom", nom: "charmander" });
    expect(lireChoix("évoli")).toEqual({ etat: "nom", nom: "eevee" });
    expect(lireChoix("M. Mime")).toEqual({ etat: "nom", nom: "mr-mime" });
    expect(lireChoix("Nidoran♀")).toEqual({ etat: "nom", nom: "nidoran-f" });
  });

  it("bonus FR-033 : le nom de l'API reste accepté (lien « Comparer » de la fiche)", () => {
    expect(lireChoix("charmander")).toEqual({ etat: "nom", nom: "charmander" });
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

describe("suggerer (Q-C1, sur le nom français : bonus FR-033)", () => {
  const noms = [
    { nom: "pikachu", nomFr: "Pikachu" },
    { nom: "raichu", nomFr: "Raichu" },
    { nom: "raticate", nomFr: "Rattatac" },
    { nom: "charmander", nomFr: "Salamèche" },
    { nom: "rattata", nomFr: "Rattata" },
  ];

  it("Pokémon dont le nom français contient la saisie, dans l'ordre de la liste, nom de l'API renvoyé", () => {
    expect(suggerer("rai", noms)).toEqual(["raichu"]);
    expect(suggerer("chu", noms)).toEqual(["pikachu", "raichu"]);
    expect(suggerer("ratta", noms)).toEqual(["raticate", "rattata"]);
  });

  it("insensible à la casse, aux accents et aux espaces autour", () => {
    expect(suggerer("  RAI ", noms)).toEqual(["raichu"]);
    expect(suggerer("salame", noms)).toEqual(["charmander"]);
    expect(suggerer("MÈCHE", noms)).toEqual(["charmander"]);
  });

  it("le nom anglais ne donne rien (clarification Q1)", () => {
    expect(suggerer("charman", noms)).toEqual([]);
  });

  it("limité à 8 par défaut, ou à la limite donnée", () => {
    const beaucoup = Array.from({ length: 20 }, (_, i) => ({ nom: `api-${i}`, nomFr: `Nom ${i}` }));
    expect(suggerer("nom", beaucoup)).toEqual(beaucoup.slice(0, 8).map((e) => e.nom));
    expect(suggerer("nom", beaucoup, 3)).toEqual(["api-0", "api-1", "api-2"]);
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
