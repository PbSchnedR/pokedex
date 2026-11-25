import BoutonTheme from "./BoutonTheme";
import LogoPokedex from "./LogoPokedex";

// Refonte « Console de poche » — bande du haut de la coque : la marque imprimée (lien vers
// l'accueil, ch. 6) et l'interrupteur du rétroéclairage (thème). Les touches de navigation sont
// dans le pupitre (Pupitre.tsx), sous l'écran sur téléphone, à sa droite sur grand écran.
// ch. 5 / ch. 6 — Flexbox : marque et interrupteur aux deux extrémités.
export default function EnTete() {
  return (
    <header className="tete">
      {/* Bonus « Monde Pokémon » (spec 002) : la marque imprimée sur la coque est aussi l'entrée
          secrète (5 activations) ; pour tout le monde, elle reste le lien d'accueil. */}
      <LogoPokedex
        className="sur-coque rounded-md px-1 font-pixel text-xl leading-none [text-shadow:0_1px_0_rgb(90_0_8/0.45)] lg:text-3xl"
      />
      <BoutonTheme />
    </header>
  );
}
