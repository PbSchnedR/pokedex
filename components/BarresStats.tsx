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
// Refonte « Console de poche » : jauge segmentée (classes .jauge / .jauge-plein, globals.css) —
// rail et remplissage partagent le même motif, donc les segments s'alignent ; le dernier segment
// peut être coupé, ce qui montre la fraction. Structure, échelle et largeur calculée inchangées.
export default function BarresStats({ stats }: { stats: Statistique[] }) {
  return (
    <dl className="grid gap-2">
      {stats.map((stat) => (
        <div key={stat.nom} className="grid grid-cols-[6.5rem_2.5rem_1fr] items-center gap-2">
          <dt className="text-xs font-semibold text-doux dark:text-doux-sombre">{LIBELLES[stat.nom] ?? stat.nom}</dt>
          <dd className="text-right font-pixel text-base tabular-nums">{stat.valeur}</dd>
          <dd aria-hidden="true" className="jauge h-4 overflow-hidden">
            <div
              className="jauge-plein h-4"
              // ch. 8 — valeur calculée, différente pour chaque barre : seul usage légitime de style.
              style={{ width: `${(stat.valeur / MAXIMUM) * 100}%` }}
            />
          </dd>
        </div>
      ))}
    </dl>
  );
}
