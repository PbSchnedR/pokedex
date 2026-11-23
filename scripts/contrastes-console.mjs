// Contrastes WCAG 2.x de la refonte « Console de poche » (docs/05-tailwind-interface.md).
// Lancer : node scripts/contrastes-console.mjs   (code de sortie 1 si une paire échoue)
// Formule : luminance relative WCAG 2.x. Un fond translucide est d'abord mélangé à son support
// (sRGB), comme le fait le navigateur. Les valeurs doivent rester celles de app/globals.css.

const rgb = (h) => [0, 2, 4].map((i) => parseInt(h.slice(1 + i, 3 + i), 16) / 255);
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = (h) => {
  const [r, g, b] = rgb(h).map(lin);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
const melange = (avant, fond, alpha) =>
  "#" +
  rgb(avant)
    .map((a, i) => Math.round((alpha * a + (1 - alpha) * rgb(fond)[i]) * 255).toString(16).padStart(2, "0"))
    .join("");

// Coque (ne change pas avec le thème).
const C = {
  coque: "#d2232f", // accent du cours
  coqueClaire: "#da2c38", // zone la plus claire du dégradé sous un texte (le reflet blanc ne passe pas sous le texte)
  coqueFoncee: "#a9161f", // bas du dégradé
  gravure: "#ffffff", // texte imprimé sur la coque
  touche: "#f6efe3", // touche ivoire
  toucheTexte: "#3a1d20",
  toucheActive: "#2d1f22", // touche enfoncée (page courante)
  toucheActiveTexte: "#fff6ea",
  voyant: "#ffc53d", // segment allumé de la touche courante
  toucheSombre: "#2d1f22", // Au hasard, flèches
  cadre: "#231a1c", // pourtour fumé de l'écran
  blanc: "#ffffff",
};

// Écran (LCD) : pâle en clair, rétroéclairé en sombre.
const E = {
  fond: "#dde4dc",
  surface: "#f4f7f2",
  encre: "#132027",
  doux: "#4a5a56",
  fondSombre: "#0c181d",
  surfaceSombre: "#142329",
  encreSombre: "#e3efe9",
  douxSombre: "#9fb5af",
  pokedex: "#d2232f",
  pokedexTexte: "#b0141f", // l'accent quand il sert de texte sur l'écran clair
  pokedexSombre: "#ff7a80",
};
E.trame = melange(E.encre, E.fond, 0.05);
E.trameSombre = melange(E.encreSombre, E.fondSombre, 0.03);

const TYPES = {
  normal: "#767668", fire: "#c4511a", water: "#2f6fd0", electric: "#946f00", grass: "#3a8436", ice: "#298083",
  fighting: "#a8322a", poison: "#8a3fa0", ground: "#8f702a", flying: "#5371c6", psychic: "#d33969", bug: "#6f7b17",
  rock: "#857431", ghost: "#5a4a8c", dragon: "#5a3fd6", dark: "#50433a", steel: "#6d6d85", fairy: "#bf4a8a",
};

const LIGNES = [
  // [avant, fond, seuil, usage]
  [C.gravure, C.coque, 4.5, "Gravure (« Mon Pokédex », pied de page) sur la coque"],
  [C.gravure, C.coqueClaire, 4.5, "Gravure sur la zone la plus claire de la coque"],
  [C.gravure, C.coqueFoncee, 4.5, "Gravure sur le bas de la coque"],
  [C.toucheTexte, C.touche, 4.5, "Libellé d'une touche ivoire"],
  [C.touche, C.coque, 3, "Touche ivoire contre la coque (contour d'un composant, 1.4.11)"],
  [C.toucheActiveTexte, C.toucheActive, 4.5, "Libellé de la touche enfoncée (page courante)"],
  [C.toucheActive, C.touche, 3, "Touche enfoncée contre touche relâchée (état)"],
  [C.toucheActive, C.coque, 3, "Touche enfoncée contre la coque"],
  [C.voyant, C.toucheActive, 3, "Voyant allumé sur la touche enfoncée"],
  [C.blanc, C.toucheSombre, 4.5, "Libellé blanc des touches sombres (Au hasard, flèches)"],
  [C.toucheSombre, C.coque, 3, "Touche sombre contre la coque"],
  [C.blanc, C.coque, 3, "Anneau de focus blanc sur la coque"],
  [C.blanc, C.coqueClaire, 3, "Anneau de focus blanc sur la zone claire de la coque"],
  [C.blanc, C.cadre, 3, "Anneau de focus blanc sur le cadre fumé"],
  [C.toucheTexte, C.voyant, 4.5, "Afficheur des flèches : texte sur LCD ambre"],
  [E.encre, E.fond, 4.5, "Texte sur l'écran clair"],
  [E.encre, E.trame, 4.5, "Texte sur une ligne de trame (clair)"],
  [E.doux, E.fond, 4.5, "Texte secondaire sur l'écran clair"],
  [E.doux, E.trame, 4.5, "Texte secondaire sur une ligne de trame (clair)"],
  [E.encre, E.surface, 4.5, "Texte sur une fiche claire"],
  [E.doux, E.surface, 4.5, "Texte secondaire sur une fiche claire"],
  [E.doux, E.fond, 3, "Bord des champs et boutons d'écran (clair)"],
  [E.pokedexTexte, E.fond, 4.5, "Accent en texte sur l'écran clair"],
  [E.pokedexTexte, E.surface, 4.5, "Accent en texte sur une fiche claire"],
  [C.blanc, E.pokedex, 4.5, "Texte blanc sur bouton rouge d'écran"],
  [E.pokedex, E.fond, 3, "Focus rouge sur l'écran clair"],
  [E.pokedex, E.surface, 3, "Focus rouge sur une fiche claire"],
  [E.encreSombre, E.fondSombre, 4.5, "Texte sur l'écran sombre"],
  [E.encreSombre, E.trameSombre, 4.5, "Texte sur une ligne de trame (sombre)"],
  [E.douxSombre, E.fondSombre, 4.5, "Texte secondaire sur l'écran sombre"],
  [E.douxSombre, E.trameSombre, 4.5, "Texte secondaire sur une ligne de trame (sombre)"],
  [E.encreSombre, E.surfaceSombre, 4.5, "Texte sur une fiche sombre"],
  [E.douxSombre, E.surfaceSombre, 4.5, "Texte secondaire sur une fiche sombre"],
  [E.douxSombre, E.fondSombre, 3, "Bord des champs et boutons d'écran (sombre)"],
  [E.pokedexSombre, E.fondSombre, 4.5, "Accent en texte / focus sur l'écran sombre"],
  [E.pokedexSombre, E.surfaceSombre, 4.5, "Accent en texte / focus sur une fiche sombre"],
];

let echecs = 0;
console.log(" ratio  seuil  verdict  usage");
for (const [a, b, seuil, usage] of LIGNES) {
  const r = ratio(a, b);
  if (r < seuil) echecs++;
  console.log(`${r.toFixed(2).padStart(6)}  ${seuil.toFixed(1).padStart(5)}  ${r >= seuil ? "ok     " : "ÉCHEC  "}  ${usage}  [${a} / ${b}]`);
}
console.log(`\nTrame : ligne claire ${E.trame}, ligne sombre ${E.trameSombre}`);
console.log("\nTexte blanc sur les 18 couleurs de type (bande N°, badges) :");
for (const [type, couleur] of Object.entries(TYPES)) {
  const r = ratio("#ffffff", couleur);
  if (r < 4.5) echecs++;
  console.log(`${r.toFixed(2).padStart(6)}  4.5  ${r >= 4.5 ? "ok   " : "ÉCHEC"}  ${type} ${couleur}`);
}
// Jauge segmentée : segment plein (teinte ; éclaircie en sombre) contre segment vide.
console.log("\nJauge : segment plein contre segment vide (seuil 3, composant graphique) :");
const railClair = melange(E.encre, E.surface, 0.12);
const railSombre = melange(E.encreSombre, E.surfaceSombre, 0.14);
for (const [type, couleur] of Object.entries(TYPES)) {
  const clair = ratio(couleur, railClair);
  const sombre = ratio(melange("#ffffff", couleur, 0.4), railSombre);
  if (clair < 3 || sombre < 3) echecs++;
  console.log(`${clair.toFixed(2).padStart(6)} (clair)  ${sombre.toFixed(2).padStart(6)} (sombre)  ${type}`);
}
console.log(echecs ? `\n${echecs} paire(s) sous le seuil.` : "\nToutes les paires passent.");
process.exit(echecs ? 1 : 0);
