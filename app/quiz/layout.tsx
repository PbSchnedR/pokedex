// La page Quiz rend un composant client ; le titre de l'onglet est posé ici, comme pour Combat.
export const metadata = { title: "Quiz" }; // onglet : « Quiz · Pokédex »

export default function LayoutQuiz({ children }: { children: React.ReactNode }) {
  return children;
}
