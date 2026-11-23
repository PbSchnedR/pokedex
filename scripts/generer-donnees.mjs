// Script lancé à la main (hors build) : `node scripts/generer-donnees.mjs`.
// Génère les données statiques des bonus (research R5 et R10) :
//   - data/pokemons-fr.json : [{ id, nom, nomFr }] trié par id (FR-033) ;
//   - data/table-types.json : efficacité attaquant → défenseur, 18 × 18 (FR-039).
// Aucune dépendance : `fetch` natif de Node (≥ 18).
// Les fichiers ne sont écrits qu'une fois TOUTES les données récupérées :
// en cas d'échec définitif, le script s'arrête sans rien écrire.

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const BASE = "https://pokeapi.co/api/v2";
const NOMBRE_POKEMON = 1025;
const TAILLE_LOT = 20;
const PAUSE_ENTRE_LOTS_MS = 1000;
const ESSAIS_SUPPLEMENTAIRES = 3;

const TYPES = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy",
];

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const dossierData = join(racine, "data");

const attendre = (ms) => new Promise((resoudre) => setTimeout(resoudre, ms));

// ch. 1 — 429 (trop de requêtes) et 5xx sont passagers : on réessaie avec une attente
// croissante ; toute autre réponse non « ok » (ex. 404) est une erreur définitive.
const appeler = async (chemin) => {
  const url = `${BASE}${chemin}`;
  let derniereErreur = null;
  for (let essai = 0; essai <= ESSAIS_SUPPLEMENTAIRES; essai++) {
    if (essai > 0) {
      const delai = 2000 * essai;
      console.warn(`  nouvel essai ${essai}/${ESSAIS_SUPPLEMENTAIRES} pour ${url} dans ${delai} ms (${derniereErreur})`);
      await attendre(delai);
    }
    let reponse;
    try {
      reponse = await fetch(url);
    } catch (erreur) {
      derniereErreur = `erreur réseau : ${erreur.cause?.code ?? erreur.message}`;
      continue;
    }
    if (reponse.ok) {
      return reponse.json();
    }
    if (reponse.status === 429 || reponse.status >= 500) {
      derniereErreur = `HTTP ${reponse.status}`;
      continue;
    }
    throw new Error(`${url} → HTTP ${reponse.status} (erreur définitive)`);
  }
  throw new Error(`${url} → échec après ${ESSAIS_SUPPLEMENTAIRES + 1} tentatives (${derniereErreur})`);
};

// Pokémon dont le nom par défaut (celui de /pokemon/{nom}) diffère du nom d'espèce.
const nomsDifferents = [];

const versEntree = (espece) => {
  const parDefaut = espece.varieties.find((variete) => variete.is_default === true);
  const nomFr = espece.names.find((entree) => entree.language.name === "fr")?.name ?? "";
  if (parDefaut === undefined) {
    throw new Error(`espèce ${espece.id} (${espece.name}) : aucune variété par défaut`);
  }
  if (nomFr.trim() === "") {
    throw new Error(`espèce ${espece.id} (${espece.name}) : aucun nom français`);
  }
  if (parDefaut.pokemon.name !== espece.name) {
    nomsDifferents.push(`${espece.id} ${espece.name} → ${parDefaut.pokemon.name}`);
  }
  return { id: espece.id, nom: parDefaut.pokemon.name, nomFr };
};

const genererNoms = async () => {
  const entrees = [];
  for (let debut = 1; debut <= NOMBRE_POKEMON; debut += TAILLE_LOT) {
    const fin = Math.min(debut + TAILLE_LOT - 1, NOMBRE_POKEMON);
    const ids = Array.from({ length: fin - debut + 1 }, (_, i) => debut + i);
    const especes = await Promise.all(ids.map((id) => appeler(`/pokemon-species/${id}`)));
    entrees.push(...especes.map(versEntree));
    console.log(`  espèces ${debut}–${fin} récupérées`);
    if (fin < NOMBRE_POKEMON) {
      await attendre(PAUSE_ENTRE_LOTS_MS);
    }
  }
  return entrees.toSorted((x, y) => x.id - y.id);
};

const genererTable = async () => {
  const table = {};
  for (const attaquant of TYPES) {
    const { damage_relations: relations } = await appeler(`/type/${attaquant}`);
    const noms = (liste) => liste.map((type) => type.name);
    const double = noms(relations.double_damage_to);
    const moitie = noms(relations.half_damage_to);
    const aucun = noms(relations.no_damage_to);
    table[attaquant] = Object.fromEntries(
      TYPES.map((defenseur) => {
        if (aucun.includes(defenseur)) return [defenseur, 0];
        if (moitie.includes(defenseur)) return [defenseur, 0.5];
        if (double.includes(defenseur)) return [defenseur, 2];
        return [defenseur, 1];
      }),
    );
  }
  return table;
};

const principal = async () => {
  console.log(`Récupération de ${NOMBRE_POKEMON} espèces (lots de ${TAILLE_LOT})…`);
  const noms = await genererNoms();
  console.log(`Récupération des ${TYPES.length} types…`);
  const table = await genererTable();

  await mkdir(dossierData, { recursive: true });
  await writeFile(join(dossierData, "pokemons-fr.json"), `${JSON.stringify(noms, null, 2)}\n`, "utf8");
  await writeFile(join(dossierData, "table-types.json"), `${JSON.stringify(table, null, 2)}\n`, "utf8");

  console.log(`OK : ${noms.length} noms → data/pokemons-fr.json, table ${TYPES.length}×${TYPES.length} → data/table-types.json`);
  console.log(`${nomsDifferents.length} nom(s) par défaut différent(s) du nom d'espèce :`);
  nomsDifferents.forEach((ligne) => console.log(`  ${ligne}`));
};

principal().catch((erreur) => {
  console.error(`ÉCHEC — aucun fichier écrit : ${erreur.message}`);
  process.exit(1);
});
