import { describe, expect, it } from "vitest";
import { validerFavoris, validerSacoche } from "@/lib/stockage";

const membre = (id: number, extra: Record<string, unknown> = {}) => ({
  id,
  nom: `pokemon-${id}`,
  image: `https://exemple/${id}.png`,
  types: ["fire"],
  surnom: "",
  ...extra,
});

describe("validerFavoris", () => {
  it("garde une liste valide telle quelle", () => {
    expect(validerFavoris({ noms: ["pikachu", "mew"] })).toEqual({ noms: ["pikachu", "mew"] });
  });

  it.each([undefined, null, "oups", 42, [], { noms: "pikachu" }, { noms: null }, {}])(
    "repart vide pour une forme inattendue (%j)",
    (valeur) => expect(validerFavoris(valeur)).toEqual({ noms: [] })
  );

  it("écarte les éléments invalides et les doublons", () => {
    expect(validerFavoris({ noms: ["mew", 3, null, "", "mew", "pikachu"] })).toEqual({ noms: ["mew", "pikachu"] });
  });
});

describe("validerSacoche", () => {
  it("garde une équipe valide, dans l'ordre", () => {
    const equipe = [membre(25, { surnom: "Pika" }), membre(4)];
    expect(validerSacoche({ equipe })).toEqual({ equipe });
  });

  it.each([undefined, null, "oups", { equipe: "oups" }, { equipe: null }, { equipe: 4 }, {}])(
    "repart vide pour une forme inattendue (%j)",
    (valeur) => expect(validerSacoche(valeur)).toEqual({ equipe: [] })
  );

  it("écarte un membre mal formé sans perdre les autres", () => {
    const sansTypes = { id: 7, nom: "squirtle", image: "x", surnom: "" };
    const resultat = validerSacoche({ equipe: [membre(1), sansTypes, null, membre(4, { id: "4" }), membre(25)] });
    expect(resultat.equipe.map((m) => m.id)).toEqual([1, 25]);
  });

  it("applique les règles de la sacoche : sans doublon, 6 au plus, surnom ≤ 12", () => {
    const equipe = [1, 1, 2, 3, 4, 5, 6, 7].map((id) => membre(id));
    expect(validerSacoche({ equipe }).equipe.map((m) => m.id)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(validerSacoche({ equipe: [membre(1, { surnom: "abcdefghijklmnop" })] }).equipe[0].surnom).toBe("abcdefghijkl");
    expect(validerSacoche({ equipe: [membre(1, { surnom: 9 })] }).equipe[0].surnom).toBe("");
  });
});
