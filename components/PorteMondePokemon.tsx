"use client";

import { useEffect, useRef } from "react";
import { adresseMondePokemon } from "@/lib/mondePokemon";

export type EtatJeuLocal = "inconnu" | "verification" | "present" | "absent";

type Props = {
  ouverte: boolean;
  codeSacoche: string | null;
  nombreMembres: number;
  jeu: EtatJeuLocal;
  onFermer: () => void;
};

// Faces du cube (6 rem de côté, demi-côté 3 rem) : position fixe, couleurs du @theme, aucune
// texture d'un autre jeu. Classes écrites en entier (ch. 5 : pas de classe construite).
const FACES = [
  "[transform:translateZ(3rem)] bg-type-ground border-t-[1.25rem] border-type-grass",
  "[transform:rotateY(90deg)_translateZ(3rem)] bg-type-ground border-t-[1.25rem] border-type-grass brightness-90",
  "[transform:rotateY(180deg)_translateZ(3rem)] bg-type-ground border-t-[1.25rem] border-type-grass",
  "[transform:rotateY(-90deg)_translateZ(3rem)] bg-type-ground border-t-[1.25rem] border-type-grass brightness-90",
  "[transform:rotateX(90deg)_translateZ(3rem)] bg-type-grass brightness-110",
  "[transform:rotateX(-90deg)_translateZ(3rem)] bg-type-ground brightness-75",
];

// Bonus « Monde Pokémon » (spec 002) — <dialog> natif ouvert par showModal() : piège du focus,
// Échap et fond assombri fournis par le navigateur (ch. 11). Le jeu n'est pas publié : le lien
// mène au jeu local, sur l'ordinateur de son créateur.
export default function PorteMondePokemon({ ouverte, codeSacoche, nombreMembres, jeu, onFermer }: Props) {
  const dialogue = useRef<HTMLDialogElement>(null);

  // ch. 4 — synchronise l'élément du navigateur avec l'état React (showModal n'a pas d'attribut).
  useEffect(() => {
    const d = dialogue.current;
    if (!d) return;
    if (ouverte && !d.open) d.showModal();
    if (!ouverte && d.open) d.close();
  }, [ouverte]);

  return (
    <dialog
      ref={dialogue}
      onClose={onFermer}
      aria-labelledby="titre-monde-pokemon"
      className="m-auto w-[min(26rem,calc(100%-2rem))] rounded-3xl bg-surface p-6 text-encre shadow-2xl backdrop:bg-black/60 dark:bg-surface-sombre dark:text-encre-sombre"
    >
      {ouverte && (
        <div className="flex animate-apparition flex-col items-center gap-4 text-center motion-reduce:animate-none">
          <div className="grid h-40 w-full place-items-center [perspective:600px]" aria-hidden="true">
            <div className="relative h-24 w-24 animate-cube [transform-style:preserve-3d] [transform:rotateX(-22deg)_rotateY(38deg)] motion-reduce:animate-none">
              {FACES.map((face) => (
                <div key={face} className={`absolute inset-0 rounded-sm ${face}`} />
              ))}
            </div>
          </div>
          <h2 id="titre-monde-pokemon" className="text-2xl font-extrabold tracking-tight">
            Monde Pokémon
          </h2>
          <p className="text-doux dark:text-doux-sombre">
            {nombreMembres > 0
              ? `Ta sacoche (${nombreMembres} Pokémon) t'y attend déjà.`
              : "Un monde à explorer, cube par cube."}
          </p>
          <a
            href={adresseMondePokemon(codeSacoche)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-pokedex px-5 py-3 text-base font-bold text-white transition-transform hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pokedex active:scale-95 motion-reduce:transition-none dark:focus-visible:outline-pokedex-sombre"
          >
            Entrer dans le Monde Pokémon
          </a>
          <p role="status" className="text-sm text-doux dark:text-doux-sombre">
            {jeu === "absent"
              ? "Le Monde Pokémon ne répond pas sur cet ordinateur : ce monde ne s'ouvre que sur l'ordinateur de son créateur."
              : "Ce monde ne s'ouvre que sur l'ordinateur de son créateur : ailleurs, le lien ne mène nulle part."}
          </p>
          <button
            type="button"
            onClick={onFermer}
            className="rounded-full px-4 py-2 font-semibold hover:bg-fond focus-visible:outline-2 focus-visible:outline-pokedex dark:hover:bg-fond-sombre dark:focus-visible:outline-pokedex-sombre"
          >
            Fermer
          </button>
        </div>
      )}
    </dialog>
  );
}
