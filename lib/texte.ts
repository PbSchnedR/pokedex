// Bonus FR-038 / FR-033 (research R6) : comparaison de textes insensible aux accents,
// à la casse et aux espaces en début/fin (« salameche » = « Salamèche »).
// NFD sépare chaque lettre accentuée en lettre + diacritique, que l'on retire ensuite.
export function normaliser(texte: string): string {
  return texte.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
}
