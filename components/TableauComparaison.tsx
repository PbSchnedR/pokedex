import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import BadgeType from "@/components/BadgeType";
import { meilleuresValeurs, type Gagnant } from "@/lib/comparaison";
import { nomFrancaisDepuisNom } from "@/lib/noms-fr";
import { teinteType } from "@/lib/types";
import type { Pokemon } from "@/types/pokemon";

// Ce que la page a trouvé pour chaque côté (adresse validée puis API interrogée).
export type Colonne =
  | { etat: "vide" }
  | { etat: "introuvable"; saisi: string; suggestions: { nom: string; lien: string }[] }
  | { etat: "trouve"; pokemon: Pokemon };

// Mêmes libellés que BarresStats (non exportés là-bas) ; l'ordre fixe garde les 6 lignes même
// quand une colonne est vide.
const LIGNES = [
  { nom: "hp", libelle: "PV" },
  { nom: "attack", libelle: "Attaque" },
  { nom: "defense", libelle: "Défense" },
  { nom: "special-attack", libelle: "Attaque spé." },
  { nom: "special-defense", libelle: "Défense spé." },
  { nom: "speed", libelle: "Vitesse" },
];

const MAXIMUM = 255; // ch. 8 — même échelle que BarresStats

const teinte = (colonne: Colonne) =>
  ({ "--teinte": colonne.etat === "trouve" ? teinteType(colonne.pokemon.types[0]) : "var(--color-gray-500)" }) as CSSProperties;

export default function TableauComparaison({ a, b }: { a: Colonne; b: Colonne }) {
  // FR-035 — on ne désigne une meilleure valeur que si les deux Pokémon sont là.
  const deux = a.etat === "trouve" && b.etat === "trouve";
  const gagnants: Record<string, Gagnant> = deux ? meilleuresValeurs(a.pokemon.stats, b.pokemon.stats) : {};

  return (
    <div className="max-w-3xl rounded-2xl bg-surface p-3 shadow-sm ring-1 ring-black/5 sm:p-4 dark:bg-surface-sombre dark:ring-white/10">
      <table className="w-full table-fixed border-separate border-spacing-x-1 border-spacing-y-1 sm:border-spacing-x-2">
        <caption className="sr-only">Statistiques de base des deux Pokémon, côte à côte</caption>
        <colgroup>
          <col className="w-22 sm:w-32" />
          <col />
          <col />
        </colgroup>
        <thead>
          <tr>
            <td />
            <EnTeteColonne colonne={a} cote="a" />
            <EnTeteColonne colonne={b} cote="b" />
          </tr>
        </thead>
        <tbody>
          {LIGNES.map((ligne) => (
            <tr key={ligne.nom}>
              <th scope="row" className="text-left text-xs font-semibold text-doux dark:text-doux-sombre">
                {ligne.libelle}
              </th>
              <Cellule colonne={a} stat={ligne.nom} gagnant={gagnants[ligne.nom]} cote="a" />
              <Cellule colonne={b} stat={ligne.nom} gagnant={gagnants[ligne.nom]} cote="b" />
            </tr>
          ))}
        </tbody>
      </table>
      {deux ? (
        <p className="mt-3 text-xs text-doux dark:text-doux-sombre">
          <span aria-hidden="true" className="font-bold text-encre dark:text-encre-sombre">▲</span> meilleure valeur de
          la ligne · <span aria-hidden="true" className="font-bold text-encre dark:text-encre-sombre">=</span> égalité
        </p>
      ) : null}
    </div>
  );
}

function EnTeteColonne({ colonne, cote }: { colonne: Colonne; cote: "a" | "b" }) {
  if (colonne.etat === "trouve") {
    const { pokemon } = colonne;
    return (
      <th scope="col" style={teinte(colonne)} className="pb-2 align-top font-normal">
        <div className="mx-auto size-16 rounded-xl bg-radial-[at_50%_35%] from-(--teinte)/40 to-(--teinte)/10 sm:size-24">
          <Image src={pokemon.image} alt="" width={96} height={96} className="size-16 object-contain p-1 sm:size-24" />
        </div>
        <p className="mt-1 text-xs font-semibold tabular-nums text-doux dark:text-doux-sombre">
          #{String(pokemon.id).padStart(3, "0")}
        </p>
        <Link
          href={`/pokemon/${pokemon.nom}`}
          className="block truncate text-base font-extrabold hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pokedex dark:focus-visible:outline-pokedex-sombre"
        >
          {pokemon.nomFr}
        </Link>
        <div className="mt-1 flex flex-wrap justify-center gap-1">
          {pokemon.types.map((type) => (
            <BadgeType key={type} type={type} />
          ))}
        </div>
      </th>
    );
  }

  // Colonne sans Pokémon : le message tient dans sa colonne, la page ne plante pas (FR-035, FR-011).
  return (
    <th scope="col" className="pb-2 align-top text-sm font-normal text-doux dark:text-doux-sombre">
      <div className="flex min-h-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-black/15 p-2 sm:min-h-32 dark:border-white/15">
        {colonne.etat === "introuvable" ? (
          <>
            <p>
              Aucun Pokémon nommé <span className="font-bold wrap-break-word text-encre dark:text-encre-sombre">{`« ${colonne.saisi} »`}</span>.
            </p>
            {colonne.suggestions.length > 0 ? (
              // Q-C1 — de simples liens (ch. 9, comme le filtre par type) : aucun JavaScript client.
              <nav aria-label={`Suggestions pour « ${colonne.saisi} »`}>
                <p>Vouliez-vous dire :</p>
                <ul className="mt-1 flex flex-wrap justify-center gap-1">
                  {colonne.suggestions.map((s) => (
                    <li key={s.nom}>
                      <Link
                        href={s.lien}
                        className="inline-block rounded-full border border-black/15 px-2 py-0.5 font-semibold text-encre hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pokedex dark:border-white/20 dark:text-encre-sombre dark:hover:bg-white/10 dark:focus-visible:outline-pokedex-sombre"
                      >
                        {nomFrancaisDepuisNom(s.nom)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </>
        ) : cote === "b" ? (
          <p>Choisissez un second Pokémon dans le champ ci-dessus.</p>
        ) : (
          <>
            <p>Aucun premier Pokémon.</p>
            <Link
              href="/"
              className="font-bold text-pokedex underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pokedex dark:text-pokedex-sombre"
            >
              Choisir une fiche
            </Link>
          </>
        )}
      </div>
    </th>
  );
}

function Cellule({
  colonne,
  stat,
  gagnant,
  cote,
}: {
  colonne: Colonne;
  stat: string;
  gagnant: Gagnant | undefined;
  cote: "a" | "b";
}) {
  const valeur = colonne.etat === "trouve" ? colonne.pokemon.stats.find((s) => s.nom === stat)?.valeur : undefined;
  if (valeur === undefined) {
    return (
      <td className="text-center text-xs text-doux dark:text-doux-sombre">
        <span aria-hidden="true">—</span>
        <span className="sr-only">non disponible</span>
      </td>
    );
  }

  const meilleure = gagnant === cote;
  const egalite = gagnant === "egalite";
  return (
    <td
      style={teinte(colonne)}
      // Meilleure valeur : fond teinté, mais aussi un cadre, la graisse et le signe ▲ (pas
      // seulement la couleur), plus un texte pour les lecteurs d'écran (ch. 11).
      className={`rounded-lg px-2 py-1 ${meilleure ? "bg-(--teinte)/15 ring-2 ring-(--teinte)" : ""}`}
    >
      <div className="flex items-baseline justify-between gap-1">
        <span className={`text-sm tabular-nums ${meilleure ? "font-extrabold" : "font-semibold"}`}>{valeur}</span>
        {meilleure ? (
          <span aria-hidden="true" className="text-xs font-bold">▲</span>
        ) : egalite ? (
          <span aria-hidden="true" className="text-xs font-bold text-doux dark:text-doux-sombre">=</span>
        ) : null}
        {meilleure ? <span className="sr-only">, meilleure valeur</span> : egalite ? <span className="sr-only">, égalité</span> : null}
      </div>
      <div aria-hidden="true" className="mt-1 h-2 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
        <div
          className="h-2 rounded-full bg-(--teinte)"
          // ch. 8 — valeur calculée propre à chaque barre : seul usage légitime de style.
          style={{ width: `${(valeur / MAXIMUM) * 100}%` }}
        />
      </div>
    </td>
  );
}
