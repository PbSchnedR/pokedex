"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, DragEvent, ReactNode } from "react";
import Icone from "@/components/Icone";
import { nomFrancais } from "@/lib/noms-fr";
import { teinteType } from "@/lib/types";
import { useSacoche, type Membre } from "@/stores/sacoche";

type Sens = "monter" | "descendre";

// Bonus FR-033 — le nom français se déduit du numéro : il n'est jamais stocké dans Membre.
const nomAffiche = (membre: Membre) => membre.surnom || nomFrancais(membre.id, membre.nom);

// Bonus FR-040 (research R9) — glisser-déposer HTML5 natif, sans bibliothèque, doublé de boutons
// « Monter » / « Descendre » pour le clavier et le tactile (le glisser HTML5 ne marche pas au
// doigt). Les deux chemins appellent la même action du store, `deplacer`, qui garde les règles.
// Le contenu de chaque carte reste écrit dans la page (`rendreMembre`) ; ce composant ne
// s'occupe que de l'ordre. `children` : les emplacements libres, rendus après les membres.
export default function ListeSacocheReordonnable({
  rendreMembre,
  children,
}: {
  rendreMembre: (membre: Membre, position: number) => ReactNode;
  children?: ReactNode;
}) {
  const equipe = useSacoche((etat) => etat.equipe);
  const deplacer = useSacoche((etat) => etat.deplacer);
  // État propre à la liste (ch. 9 : ce qui ne concerne qu'un composant reste dans un useState).
  const [glisse, setGlisse] = useState<number | null>(null); // indice du membre tenu
  const [cible, setCible] = useState<number | null>(null); // indice survolé (zone de dépôt)
  const [annonce, setAnnonce] = useState("");
  // ch. 10 — useRef : les boutons du DOM, et le bouton à refocaliser après un déplacement.
  const boutons = useRef(new Map<string, HTMLButtonElement | null>());
  const aFocaliser = useRef<{ id: number; sens: Sens } | null>(null);

  // Le focus reste sur le membre déplacé : même bouton, ou l'autre s'il vient d'être désactivé
  // (« Monter » du membre arrivé en tête, par exemple).
  useEffect(() => {
    const demande = aFocaliser.current;
    if (!demande) return;
    aFocaliser.current = null;
    const autre: Sens = demande.sens === "monter" ? "descendre" : "monter";
    const bouton = boutons.current.get(`${demande.id}-${demande.sens}`);
    (bouton && !bouton.disabled ? bouton : boutons.current.get(`${demande.id}-${autre}`))?.focus();
  }, [equipe]);

  const reordonner = (depuis: number, vers: number) => {
    if (depuis === vers || !equipe[depuis] || !equipe[vers]) return;
    const nouvelOrdre = [...equipe];
    const [membre] = nouvelOrdre.splice(depuis, 1);
    nouvelOrdre.splice(vers, 0, membre);
    deplacer(depuis, vers);
    setAnnonce(
      `${nomAffiche(membre)} est maintenant en position ${vers + 1} sur ${equipe.length}. ` +
        `Nouvel ordre : ${nouvelOrdre.map(nomAffiche).join(", ")}.`
    );
  };

  const finirGlisser = () => {
    setGlisse(null);
    setCible(null);
  };

  const quitterCible = (e: DragEvent<HTMLLIElement>) => {
    // dragleave se déclenche aussi en passant sur un enfant de la carte : on l'ignore.
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setCible(null);
  };

  return (
    <>
      {equipe.length > 1 && (
        <p className="mt-1 text-sm text-doux dark:text-doux-sombre">
          Glissez une carte, ou utilisez ses flèches, pour changer l&apos;ordre.
        </p>
      )}
      {/* Refonte « Console de poche » : colonnes selon la largeur de l'écran de la console
          (requêtes de conteneur), comme la grille des Pokémon. */}
      <div className="@container mt-6">
        <ul className="grid grid-cols-2 gap-3 @min-[30rem]:grid-cols-3 @min-[30rem]:gap-4 @min-[52rem]:grid-cols-6">
          {equipe.map((membre, i) => (
            <li
              key={membre.id}
              draggable
              onDragStart={(e) => {
                // Sélectionner le texte du surnom ne doit pas soulever la carte.
                if (e.target instanceof HTMLInputElement) return e.preventDefault();
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", String(i)); // requis par Firefox pour démarrer
                // Saisie sur l'illustration (une <img> se glisse seule) : on montre quand même toute la carte.
                const cadre = e.currentTarget.getBoundingClientRect();
                e.dataTransfer.setDragImage(e.currentTarget, e.clientX - cadre.left, e.clientY - cadre.top);
                setGlisse(i);
              }}
              onDragOver={(e) => {
                if (glisse === null) return; // un fichier ou un texte venu d'ailleurs : pas de dépôt
                e.preventDefault(); // autorise le dépôt ici
                e.dataTransfer.dropEffect = "move";
                if (cible !== i) setCible(i);
              }}
              onDragLeave={quitterCible}
              onDrop={(e) => {
                e.preventDefault();
                if (glisse !== null) reordonner(glisse, i);
                finirGlisser();
              }}
              onDragEnd={finirGlisser}
              style={{ "--teinte": teinteType(membre.types[0]) } as CSSProperties}
              className={`relative flex cursor-grab flex-col overflow-hidden rounded-md bg-surface shadow-sm ring-1 ring-black/10
                          transition-opacity duration-150 active:cursor-grabbing motion-reduce:transition-none
                          dark:bg-surface-sombre dark:ring-white/10 ${glisse === i ? "opacity-40" : ""} ${
                            cible === i && glisse !== i
                              ? "outline-2 outline-offset-4 outline-dashed outline-pokedex dark:outline-pokedex-sombre"
                              : ""
                          }`}
            >
              {rendreMembre(membre, i)}
              <div className="mt-auto flex justify-end gap-2 px-2 pb-2">
                {(["monter", "descendre"] as const).map((sens) => {
                  const vers = sens === "monter" ? i - 1 : i + 1;
                  return (
                    <button
                      key={sens}
                      type="button"
                      ref={(bouton) => {
                        boutons.current.set(`${membre.id}-${sens}`, bouton);
                      }}
                      disabled={vers < 0 || vers >= equipe.length}
                      onClick={() => {
                        aFocaliser.current = { id: membre.id, sens };
                        reordonner(i, vers);
                      }}
                      className="grid size-10 place-items-center rounded-md bg-fond text-doux
                                 transition-transform hover:text-pokedex-texte active:scale-90 focus-visible:outline-2
                                 focus-visible:outline-offset-2 focus-visible:outline-pokedex disabled:opacity-30
                                 disabled:hover:text-doux motion-reduce:transition-none dark:bg-fond-sombre
                                 dark:text-doux-sombre dark:hover:text-pokedex-sombre dark:focus-visible:outline-pokedex-sombre"
                    >
                      <Icone nom={sens === "monter" ? "flecheHaut" : "flecheBas"} className="size-4" />
                      <span className="sr-only">
                        {sens === "monter" ? "Monter" : "Descendre"} {nomAffiche(membre)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
          {children}
        </ul>
      </div>
      {/* ch. 11 — le nouvel ordre est lu par les lecteurs d'écran, sans voler le focus. */}
      <p aria-live="polite" className="sr-only">
        {annonce}
      </p>
    </>
  );
}
