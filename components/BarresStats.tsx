import type { Statistique } from "@/types/pokemon";

const LIBELLES: Record<string, string> = {
  hp: "PV",
  attack: "Attaque",
  defense: "Défense",
  "special-attack": "Attaque spé.",
  "special-defense": "Défense spé.",
  speed: "Vitesse",
};

// ch. 8 — échelle du cours : une statistique de base ne dépasse pas 255.
const MAXIMUM = 255;

// Remplissage dans la teinte du type (--teinte, posée par la fiche) ; rail neutre comme le cours.
export default function BarresStats({ stats }: { stats: Statistique[] }) {
  return (
    <dl className="grid gap-2">
      {stats.map((stat) => (
        <div key={stat.nom} className="grid grid-cols-[7rem_2.5rem_1fr] items-center gap-2">
          <dt className="text-xs font-semibold text-doux dark:text-doux-sombre">{LIBELLES[stat.nom] ?? stat.nom}</dt>
          <dd className="text-right text-xs font-bold tabular-nums">{stat.valeur}</dd>
          <dd aria-hidden="true" className="h-4 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
            <div
              className="h-4 rounded-full bg-(--teinte)"
              // ch. 8 — valeur calculée, différente pour chaque barre : seul usage légitime de style.
              style={{ width: `${(stat.valeur / MAXIMUM) * 100}%` }}
            />
          </dd>
        </div>
      ))}
    </dl>
  );
}
