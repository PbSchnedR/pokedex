import type { Metadata } from "next";
import { Suspense } from "react";
import { Bricolage_Grotesque, Tiny5 } from "next/font/google";
import EnTete from "@/components/EnTete";
import HydratationStores from "@/components/HydratationStores";
import PiedDePage from "@/components/PiedDePage";
import Pupitre from "@/components/Pupitre";
import RemiseEnHautEcran from "@/components/RemiseEnHautEcran";
import "./globals.css";

// ch. 6 — polices servies par next/font (aucune requête vers Google côté visiteur).
// Bricolage Grotesque : texte courant ; axe wdth pour les numéros étroits (T076 : sans opsz).
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  axes: ["wdth"],
});
// Refonte « Console de poche » — Tiny5, police pixel à une seule graisse (font-data.json de
// Next 16.4 : 400, latin), réservée aux titres, numéros et libellés courts (classe font-pixel).
const tiny5 = Tiny5({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-tiny5",
});

export const metadata: Metadata = {
  title: { default: "Pokédex", template: "%s · Pokédex" },
  description: "Les 1 025 Pokémon, leurs types et leurs statistiques.",
};

// FR-023 / research R7 — lit le thème mémorisé et pose la classe `dark` avant le premier
// affichage : pas de flash clair. Stockage indisponible → thème clair.
const SCRIPT_THEME = `(function(){try{if(localStorage.getItem("pokedex-theme")==="sombre")document.documentElement.classList.add("dark")}catch(e){}})()`;

// Refonte « Console de poche » : le site entier est un appareil de poche qui remplit la fenêtre.
// La page ne défile pas ; seul l'écran (<main>) défile. Ordre du DOM = ordre du clavier :
// marque et interrupteur, touches de navigation, écran, pied. La grille CSS de .appareil
// (globals.css) place le pupitre sous l'écran sur téléphone, à sa droite sur grand écran.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning : la classe de <html> diffère entre serveur et navigateur par construction.
    <html lang="fr" className={`${bricolage.variable} ${tiny5.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_THEME }} />
      </head>
      <body className="font-sans antialiased">
        <HydratationStores />
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-30 focus:rounded-md focus:bg-touche
                     focus:px-4 focus:py-2 focus:font-bold focus:text-touche-encre focus:outline-3 focus:outline-offset-2 focus:outline-white"
        >
          Aller au contenu
        </a>
        <div className="appareil">
          {/* Vis moulées : décor du grand écran, sans rôle. */}
          <span aria-hidden="true" className="vis left-4 top-4 hidden lg:block" />
          <span aria-hidden="true" className="vis right-4 top-4 hidden lg:block" />
          <span aria-hidden="true" className="vis bottom-4 left-5 hidden lg:block" />
          <span aria-hidden="true" className="vis bottom-4 right-5 hidden lg:block" />
          <EnTete />
          <Pupitre />
          <div className="cadre">
            {/* tabIndex={-1} : l'ancre « Aller au contenu » y place le focus, et Page↓ / espace
                font alors défiler l'écran. */}
            <main
              id="contenu"
              tabIndex={-1}
              className="ecran px-3 py-4 text-encre sm:px-4 lg:px-6 lg:py-6 dark:text-encre-sombre"
            >
              {children}
            </main>
          </div>
          <PiedDePage />
        </div>
        {/* Remet l'écran en haut à chaque changement d'adresse (useSearchParams : sous Suspense). */}
        <Suspense fallback={null}>
          <RemiseEnHautEcran />
        </Suspense>
      </body>
    </html>
  );
}
