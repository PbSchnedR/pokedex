import { describe, expect, it } from "vitest";
import { enregistrerActivation } from "@/lib/compteurClics";

// Rejoue une suite d'instants (ms) et renvoie, pour chacun, si le secret s'est déclenché.
function rejouer(instants: number[]) {
  let horodatages: number[] = [];
  return instants.map((t) => {
    const r = enregistrerActivation(horodatages, t);
    horodatages = r.horodatages;
    return r.declenche;
  });
}

describe("enregistrerActivation", () => {
  it("déclenche à la 5e activation en moins de 3 s", () => {
    expect(rejouer([0, 300, 600, 900, 1200])).toEqual([false, false, false, false, true]);
  });

  it("ne déclenche pas avec 4 activations", () => {
    expect(rejouer([0, 100, 200, 300])).not.toContain(true);
  });

  it("ne déclenche pas avec 5 activations étalées sur plus de 3 s", () => {
    expect(rejouer([0, 800, 1600, 2400, 3200])).not.toContain(true);
  });

  it("repart de zéro après le déclenchement", () => {
    expect(rejouer([0, 1, 2, 3, 4, 5, 6, 7, 8])).toEqual([false, false, false, false, true, false, false, false, false]);
  });
});
