import { describe, expect, it } from "vitest";
import { creerCodeSacoche } from "@/lib/codeSacoche";

// Vecteurs partagés avec le jeu (contracts/code-sacoche.md) : mêmes chaînes dans
// pokemonde/crates/pokemonde-web/src/sacoche.rs. Calculés une fois, puis figés.
const CODE_PIKA = "PKMD1.eyJtZW1icmVzIjpbeyJpZCI6MjUsInN1cm5vbSI6IlBpa2EifV19.fd9e648c";
const CODE_HORS_MONDE = "PKMD1.eyJtZW1icmVzIjpbeyJpZCI6NDQ4LCJzdXJub20iOiIifSx7ImlkIjoxLCJzdXJub20iOiIifV19.f530a8df";
const CODE_ACCENTS =
  "PKMD1.eyJtZW1icmVzIjpbeyJpZCI6MjUsInN1cm5vbSI6IsOJbGVjdHJpayJ9LHsiaWQiOjQsInN1cm5vbSI6IiJ9LHsiaWQiOjcsInN1cm5vbSI6IkNhcmFwdWNlIn1dfQ.ce58b660";

describe("creerCodeSacoche", () => {
  it("vecteur 1 : [{25, « Pika »}] donne le code figé", async () => {
    expect(await creerCodeSacoche([{ id: 25, surnom: "Pika" }])).toBe(CODE_PIKA);
  });

  it("vecteur 3 : [{448, « »}, {1, « »}] donne le code figé", async () => {
    expect(await creerCodeSacoche([{ id: 448, surnom: "" }, { id: 1, surnom: "" }])).toBe(CODE_HORS_MONDE);
  });

  it("encode les accents en UTF-8", async () => {
    const membres = [
      { id: 25, surnom: "Électrik" },
      { id: 4, surnom: "" },
      { id: 7, surnom: "Carapuce" },
    ];
    expect(await creerCodeSacoche(membres)).toBe(CODE_ACCENTS);
  });

  it("ne recopie que id et surnom", async () => {
    const membre = { id: 25, surnom: "Pika", nom: "Pikachu", image: "x.png", types: ["electric"] };
    expect(await creerCodeSacoche([membre])).toBe(CODE_PIKA);
  });

  it("refuse une sacoche vide, trop grande, avec doublon ou numéro hors bornes", async () => {
    expect(await creerCodeSacoche([])).toBeNull();
    const sept = [1, 2, 3, 4, 5, 6, 7].map((id) => ({ id, surnom: "" }));
    expect(await creerCodeSacoche(sept)).toBeNull();
    expect(await creerCodeSacoche([{ id: 1, surnom: "" }, { id: 1, surnom: "a" }])).toBeNull();
    expect(await creerCodeSacoche([{ id: 1026, surnom: "" }])).toBeNull();
    expect(await creerCodeSacoche([{ id: 0, surnom: "" }])).toBeNull();
    expect(await creerCodeSacoche([{ id: 1, surnom: "treize lettres" }])).toBeNull();
  });
});
