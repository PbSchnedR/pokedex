"use client";

import { TAILLE_SACOCHE, useSacoche } from "@/stores/sacoche";
import LienNav from "./LienNav";

// ch. 9 — six segments pleins ou vides. Le sélecteur renvoie un nombre : l'indicateur ne se
// réaffiche que si la taille de l'équipe change (pas quand on modifie un surnom).
// Refonte « Console de poche » : c'est la touche « Sacoche » du pupitre ; son mini-afficheur
// montre « 3/6 » sur téléphone, les six segments dès que la touche est assez large.
export default function IndicateurSacoche() {
  const nombre = useSacoche((etat) => etat.equipe.length);
  return (
    <LienNav href="/sacoche" aria-label={`Sacoche : ${nombre} Pokémon sur ${TAILLE_SACOCHE}`} className="touche">
      <span aria-hidden="true" className="voyant" />
      <span className="touche-libelle">Sacoche</span>
      <span className="afficheur touche-compteur">
        <span className="paysage:hidden">
          {nombre}/{TAILLE_SACOCHE}
        </span>
        <span className="hidden items-center gap-0.5 paysage:flex">
          {Array.from({ length: TAILLE_SACOCHE }, (_, i) => (
            <span key={i} className={`segment ${i < nombre ? "segment-allume" : ""}`} />
          ))}
        </span>
      </span>
    </LienNav>
  );
}
