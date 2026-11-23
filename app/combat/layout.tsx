// La page Combat est un composant client : l'export `metadata` (réservé aux composants
// serveur, ch. 6) passe donc dans ce layout serveur du dossier (contracts/routes.md).
export const metadata = { title: "Combat" }; // onglet : « Combat · Pokédex »

export default function LayoutCombat({ children }: { children: React.ReactNode }) {
  return children;
}
