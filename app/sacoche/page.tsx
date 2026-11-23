// Page provisoire sur le modèle de /favoris (ch. 6) : évite un 404 au préchargement du lien
// « Sacoche » de l'en-tête. Remplacée à l'étape 16 (T063) ; la metadata passera dans layout.tsx.
export const metadata = { title: "Sacoche" }; // onglet : « Sacoche · Pokédex »

export default function PageSacoche() {
  return <h1 className="text-3xl font-extrabold tracking-tight font-stretch-85%">Ma sacoche</h1>;
}
