// La page Sacoche est un composant client : sa `metadata` (réservée aux composants serveur,
// ch. 6) passe dans ce layout serveur du dossier (contracts/routes.md).
export const metadata = { title: "Sacoche" }; // onglet : « Sacoche · Pokédex »

export default function LayoutSacoche({ children }: { children: React.ReactNode }) {
  return children;
}
