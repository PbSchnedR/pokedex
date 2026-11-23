// Même forme que favoris/sacoche : le titre d'onglet de la section vit dans le layout du dossier
// (contracts/routes.md) ; le gabarit du layout racine donne « Comparer · Pokédex ».
export const metadata = { title: "Comparer" };

export default function LayoutComparer({ children }: { children: React.ReactNode }) {
  return children;
}
