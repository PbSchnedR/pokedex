import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Pokemon } from "@/types/pokemon";

// Vitest tourne sous Node, sans navigateur : persist lit `window.localStorage` à la création du
// store, donc on en fournit un en mémoire AVANT l'import. Cela permet aussi de vérifier la forme
// réellement stockée.
const memoire = vi.hoisted(() => {
  const valeurs = new Map<string, string>();
  vi.stubGlobal("window", {
    localStorage: {
      getItem: (cle: string) => valeurs.get(cle) ?? null,
      setItem: (cle: string, valeur: string) => void valeurs.set(cle, valeur),
      removeItem: (cle: string) => void valeurs.delete(cle),
    },
  });
  return valeurs;
});

const { TAILLE_SACOCHE, useSacoche } = await import("@/stores/sacoche");

// Seuls les champs repris par `Membre` comptent ici ; le reste du type Pokemon est hors sujet.
const pokemon = (id: number, nom: string) =>
  ({ id, nom, image: `/${nom}.png`, types: ["normal"] }) as unknown as Pokemon;

const noms = () => useSacoche.getState().equipe.map((membre) => membre.nom);

describe("useSacoche — deplacer (bonus FR-040)", () => {
  beforeEach(() => {
    useSacoche.setState({ equipe: [] });
    const { ajouter } = useSacoche.getState();
    ["a", "b", "c", "d"].forEach((nom, i) => ajouter(pokemon(i + 1, nom)));
  });

  it("met le 3ᵉ membre en tête", () => {
    useSacoche.getState().deplacer(2, 0);
    expect(noms()).toEqual(["c", "a", "b", "d"]);
  });

  it("met le premier membre en fin", () => {
    useSacoche.getState().deplacer(0, 3);
    expect(noms()).toEqual(["b", "c", "d", "a"]);
  });

  it("déplace au milieu, dans les deux sens", () => {
    useSacoche.getState().deplacer(1, 2);
    expect(noms()).toEqual(["a", "c", "b", "d"]);
    useSacoche.getState().deplacer(3, 1);
    expect(noms()).toEqual(["a", "d", "c", "b"]);
  });

  it("renvoie un nouveau tableau (pas de mutation de l'ancien)", () => {
    const avant = useSacoche.getState().equipe;
    useSacoche.getState().deplacer(0, 1);
    expect(useSacoche.getState().equipe).not.toBe(avant);
    expect(avant.map((membre) => membre.nom)).toEqual(["a", "b", "c", "d"]);
  });

  it.each([
    [-1, 0],
    [0, -1],
    [4, 0],
    [0, 4],
    [1.5, 0],
    [Number.NaN, 0],
  ])("laisse l'état inchangé hors bornes (%s → %s)", (depuis, vers) => {
    const avant = useSacoche.getState().equipe;
    useSacoche.getState().deplacer(depuis, vers);
    expect(useSacoche.getState().equipe).toBe(avant);
  });

  it("laisse l'état inchangé pour un même indice", () => {
    const avant = useSacoche.getState().equipe;
    useSacoche.getState().deplacer(2, 2);
    expect(useSacoche.getState().equipe).toBe(avant);
  });

  it("garde le surnom du membre déplacé", () => {
    useSacoche.getState().renommer(3, "Chef");
    useSacoche.getState().deplacer(2, 0);
    expect(useSacoche.getState().equipe[0]).toMatchObject({ id: 3, surnom: "Chef" });
  });

  it("garde les règles : 6 au plus, sans doublon, après des déplacements", () => {
    const { ajouter, deplacer } = useSacoche.getState();
    ajouter(pokemon(5, "e"));
    ajouter(pokemon(6, "f"));
    deplacer(5, 0);
    deplacer(0, 5);
    deplacer(2, 4);
    ajouter(pokemon(7, "g")); // 7ᵉ : refusé
    ajouter(pokemon(1, "a")); // doublon : refusé
    const ids = useSacoche.getState().equipe.map((membre) => membre.id);
    expect(ids).toHaveLength(TAILLE_SACOCHE);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("persiste le nouvel ordre sous pokedex-sacoche, forme du contrat inchangée", () => {
    useSacoche.getState().deplacer(2, 0);
    const stocke = JSON.parse(memoire.get("pokedex-sacoche") ?? "null");
    expect(Object.keys(stocke).sort()).toEqual(["state", "version"]);
    expect(stocke.version).toBe(0);
    expect(Object.keys(stocke.state)).toEqual(["equipe"]);
    expect(stocke.state.equipe.map((membre: { nom: string }) => membre.nom)).toEqual(["c", "a", "b", "d"]);
  });
});
