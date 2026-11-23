import type { CSSProperties } from "react";
import Image from "next/image";
import BadgeType from "@/components/BadgeType";
import type { ResultatCombat as Resultat } from "@/lib/combat";
import { teinteType } from "@/lib/types";
import type { Pokemon } from "@/types/pokemon";

// Bonus FR-039 — affichage seul (aucun hook) : le calcul vient de lib/combat.ts. Le détail de
// chaque duel (stats, multiplicateur, score, vainqueur) est affiché pour que le résultat
// s'explique à l'écran (research R10).

const nombre = (valeur: number) => valeur.toLocaleString("fr-FR"); // 0,25 et non 0.25
const accord = (n: number, mot: string) => `${n} ${mot}${n > 1 ? "s" : ""}`;

const ISSUES = {
  victoire: { titre: "Victoire !", classe: "text-pokedex-texte dark:text-pokedex-sombre" },
  defaite: { titre: "Défaite", classe: "" },
  nul: { titre: "Match nul", classe: "" },
};

type PropsCombattant = {
  pokemon: Pokemon;
  camp: string;
  multiplicateur: number;
  score: number;
  gagnant: boolean;
};

function Combattant({ pokemon, camp, multiplicateur, score, gagnant }: PropsCombattant) {
  const total = pokemon.stats.reduce((somme, stat) => somme + stat.valeur, 0);
  // ch. 5 — teinte du type principal par variable CSS locale, comme les vignettes de la grille.
  const teinte = { "--teinte": teinteType(pokemon.types[0]) } as CSSProperties;

  return (
    <div
      style={teinte}
      className={`relative flex h-full flex-col rounded-md bg-surface p-2 shadow-sm dark:bg-surface-sombre ${
        gagnant ? "ring-2 ring-pokedex dark:ring-pokedex-sombre" : "ring-1 ring-black/5 dark:ring-white/10"
      }`}
    >
      <div className="relative h-28 overflow-hidden rounded-sm bg-radial-[at_50%_35%] from-(--teinte)/35 to-(--teinte)/10">
        <Image src={pokemon.image} alt={pokemon.nomFr} width={96} height={96} className="mx-auto size-full object-contain p-2 drop-shadow-lg" />
      </div>
      <div className="flex grow flex-col p-2">
        <p className="text-xs font-semibold text-doux dark:text-doux-sombre">{camp}</p>
        {/* Après « Vous » / « Adversaire » dans le code, pour l'ordre de lecture ; posée sur l'image. */}
        {gagnant ? (
          <span className="absolute left-4 top-4 rounded-md bg-pokedex px-2 py-0.5 text-xs font-bold text-white">Vainqueur</span>
        ) : null}
        <p className="truncate text-base font-bold">{pokemon.nomFr}</p>
        <div className="mt-1 flex flex-wrap gap-1">
          {pokemon.types.map((type) => (
            <BadgeType key={type} type={type} />
          ))}
        </div>
        <dl className="mt-auto grid grid-cols-[1fr_auto] gap-x-2 pt-2 text-xs tabular-nums">
          <dt className="text-doux dark:text-doux-sombre">Stats (total)</dt>
          <dd className="text-right font-semibold">{nombre(total)}</dd>
          <dt className="text-doux dark:text-doux-sombre">Avantage</dt>
          <dd className="text-right font-semibold">×{nombre(multiplicateur)}</dd>
          <dt className="self-end text-doux dark:text-doux-sombre">Score</dt>
          <dd className="text-right text-3xl leading-none font-pixel ">{nombre(score)}</dd>
        </dl>
      </div>
    </div>
  );
}

export default function ResultatCombat({
  resultat,
  children,
}: {
  resultat: Resultat<Pokemon>;
  children?: React.ReactNode; // action « Nouvel adversaire », fournie par la page
}) {
  const { duels, victoiresA, victoiresB, issue } = resultat;
  const nuls = duels.length - victoiresA - victoiresB;

  return (
    <>
      <section
        aria-labelledby="titre-issue"
        className="flex flex-wrap items-center justify-between gap-4 rounded-md bg-surface p-4 shadow-sm ring-1 ring-black/5
                   dark:bg-surface-sombre dark:ring-white/10"
      >
        <div>
          <h2 id="titre-issue" className={`font-pixel text-3xl ${ISSUES[issue].classe}`}>
            {ISSUES[issue].titre}
          </h2>
          <p className="mt-1 text-base text-doux dark:text-doux-sombre">
            {accord(victoiresA, "gagné")}, {accord(victoiresB, "perdu")}, {accord(nuls, "nul")} sur {accord(duels.length, "duel")}
          </p>
        </div>
        {/* Marque façon album, décorative : la phrase ci-dessus dit la même chose. */}
        <p aria-hidden="true" className="text-6xl leading-none font-pixel tabular-nums  text-doux/40 dark:text-doux-sombre/40">
          {victoiresA}–{victoiresB}
        </p>
        {children}
      </section>

      <section aria-labelledby="titre-duels" className="mt-8">
        <h2 id="titre-duels" className="font-pixel text-3xl">
          Les duels
        </h2>
        <ol className="mt-4 grid gap-6 lg:grid-cols-2">
          {duels.map((duel, i) => (
            <li
              key={`${duel.a.id}-${duel.b.id}`}
              className="animate-apparition motion-reduce:animate-none"
            >
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-base font-bold">Duel {i + 1}</h3>
                <p className="text-xs font-semibold text-doux dark:text-doux-sombre">
                  {duel.vainqueur === "nul" ? (
                    "Égalité"
                  ) : (
                    <>
                      {duel.vainqueur === "a" ? duel.a.nomFr : duel.b.nomFr} l&apos;emporte
                    </>
                  )}
                </p>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <Combattant pokemon={duel.a} camp="Vous" multiplicateur={duel.multA} score={duel.scoreA} gagnant={duel.vainqueur === "a"} />
                <Combattant pokemon={duel.b} camp="Adversaire" multiplicateur={duel.multB} score={duel.scoreB} gagnant={duel.vainqueur === "b"} />
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
