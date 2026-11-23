// La page Favoris est un composant client : l'export `metadata` (réservé aux composants
// serveur, ch. 6) passe donc dans ce layout serveur du dossier (contracts/routes.md).
export const metadata = { title: "Favoris" }; // onglet : « Favoris · Pokédex »

export default function LayoutFavoris({ children }: { children: React.ReactNode }) {
  return children;
}
