import { TYPES } from "@/lib/types";

export default function BadgeType({ type }: { type: string }) {
  // ch. 5 — classe lue dans la table (jamais construite) ; type inconnu → gris, libellé brut.
  const style = TYPES[type] ?? { libelle: type, classe: "bg-gray-500" };
  return (
    // dark:ring : les types les plus sombres (dark, ghost…) restent détourés sur fond sombre.
    <span className={`rounded-sm px-1.5 py-0.5 text-xs font-bold text-white dark:ring-1 dark:ring-white/20 ${style.classe}`}>
      {style.libelle}
    </span>
  );
}
