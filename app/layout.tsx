import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import EnTete from "@/components/EnTete";
import HydratationStores from "@/components/HydratationStores";
import PiedDePage from "@/components/PiedDePage";
import "./globals.css";

// ch. 6 — police servie par next/font (aucune requête vers Google côté visiteur).
// Bricolage Grotesque : direction « Album à compléter » (T012) ; axe wdth pour les numéros étroits.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  // T076 — axe wdth seul (numéros étroits) : sans opsz, le fichier de police est plus léger.
  axes: ["wdth"],
});

export const metadata: Metadata = {
  title: { default: "Pokédex", template: "%s · Pokédex" },
  description: "Les 1 025 Pokémon, leurs types et leurs statistiques.",
};

// FR-023 / research R7 — lit le thème mémorisé et pose la classe `dark` avant le premier
// affichage : pas de flash clair. Stockage indisponible → thème clair.
const SCRIPT_THEME = `(function(){try{if(localStorage.getItem("pokedex-theme")==="sombre")document.documentElement.classList.add("dark")}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning : la classe de <html> diffère entre serveur et navigateur par construction.
    <html lang="fr" className={bricolage.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_THEME }} />
      </head>
      <body className="min-h-dvh bg-fond font-sans text-encre antialiased dark:bg-fond-sombre dark:text-encre-sombre">
        <HydratationStores />
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-20 focus:rounded-full focus:bg-pokedex focus:px-4 focus:py-2 focus:text-white"
        >
          Aller au contenu
        </a>
        <EnTete />
        <main id="contenu" className="mx-auto max-w-6xl px-4 py-6">
          {children}
        </main>
        <PiedDePage />
      </body>
    </html>
  );
}
