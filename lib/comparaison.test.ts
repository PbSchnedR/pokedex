import { describe, expect, it } from "vitest";
import { lireChoix, lireComparaison, meilleuresValeurs } from "@/lib/comparaison";

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
