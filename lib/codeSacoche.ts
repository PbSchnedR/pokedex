import type { Membre } from "@/stores/sacoche";

// Bonus « Monde Pokémon » (spec 002, contracts/code-sacoche.md) — code de transfert de la sacoche
// vers le jeu local : PKMD1.<données en base64url>.<8 hex du SHA-256 des données>.

// ch. 3 — Pick : le jeu n'a besoin que du numéro et du surnom (data-model « CodeSacoche »).
export type MembreTransfert = Pick<Membre, "id" | "surnom">;

export const PREFIXE_CODE = "PKMD1";
const MEMBRES_MAX = 6;
const NUMERO_MAX = 1025;
const SURNOM_MAX = 12;

function estValide(membres: MembreTransfert[]): boolean {
  if (membres.length === 0 || membres.length > MEMBRES_MAX) return false;
  const numeros = new Set(membres.map((m) => m.id));
  return (
    numeros.size === membres.length &&
    membres.every(
      (m) => Number.isInteger(m.id) && m.id >= 1 && m.id <= NUMERO_MAX && m.surnom.length <= SURNOM_MAX
    )
  );
}

// base64url sans « = » d'un texte encodé en UTF-8 (btoa ne lit que des octets 0–255).
function versBase64Url(texte: string): string {
  let binaire = "";
  for (const octet of new TextEncoder().encode(texte)) binaire += String.fromCharCode(octet);
  return btoa(binaire).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function empreinte(texte: string): Promise<string> {
  const condensat = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(texte));
  return [...new Uint8Array(condensat).slice(0, 4)].map((o) => o.toString(16).padStart(2, "0")).join("");
}

// Sacoche vide ou hors des règles du contrat → null (le lien du jeu part alors sans paramètre).
// On ne recopie que `id` et `surnom` : aucun autre champ n'est accepté par le jeu.
export async function creerCodeSacoche(membres: MembreTransfert[]): Promise<string | null> {
  if (!estValide(membres)) return null;
  const json = JSON.stringify({ membres: membres.map(({ id, surnom }) => ({ id, surnom })) });
  const donnees = versBase64Url(json);
  return `${PREFIXE_CODE}.${donnees}.${await empreinte(donnees)}`;
}
