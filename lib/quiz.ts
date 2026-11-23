import { normaliser } from "@/lib/texte";

// Bonus FR-038 (research R11, clarification Q3) — verdict du quiz des silhouettes.
// « vide » : rien d'utile n'a été tapé (espaces seuls compris) ; la réponse est refusée,
// le Pokémon n'est pas révélé.
export type Verdict = "vide" | "juste" | "faux";

// Compare la saisie au nom français attendu, sans tenir compte des accents, des majuscules
// ni des espaces en début et en fin (« SALAMECHE » = « Salamèche »).
export function verifierReponse(saisie: string, nomAttendu: string): Verdict {
  const reponse = normaliser(saisie);
  if (reponse === "") return "vide";
  return reponse === normaliser(nomAttendu) ? "juste" : "faux";
}
