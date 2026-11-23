import { connection, NextResponse } from "next/server";
import { recupererPokemon, TOTAL_POKEMONS } from "@/lib/pokeapi";

// ch. 11 — Route Handler : notre propre point d'API, en JSON (contracts/api-aleatoire.md).
export async function GET() {
  // Sans cette ligne, Next.js préparerait la réponse à l'avance : même tirage pour tout le monde.
  await connection();
  const id = Math.floor(Math.random() * TOTAL_POKEMONS) + 1;
  const pokemon = await recupererPokemon(String(id));
  if (!pokemon) {
    return NextResponse.json({ erreur: "Pokémon introuvable" }, { status: 404 });
  }
  return NextResponse.json(pokemon);
}
