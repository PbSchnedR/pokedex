// Refonte « Console de poche » — bande du bas de la coque : grille de haut-parleur moulée
// (décor) et mention des données, imprimée en blanc sur le plastique.
export default function PiedDePage() {
  return (
    <footer className="pied text-xs">
      <span aria-hidden="true" className="fentes" />
      <p>
        Données :{" "}
        <a href="https://pokeapi.co" className="sur-coque rounded-sm font-semibold underline underline-offset-4">
          PokéAPI
        </a>
      </p>
    </footer>
  );
}
