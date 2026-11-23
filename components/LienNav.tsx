"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  href: string;
  className: string;
  children: React.ReactNode;
  "aria-label"?: string;
};

// ch. 10 — usePathname : la page courante est signalée par aria-current="page". Refonte
// « Console de poche » : c'est la classe .touche (globals.css) qui lit cet attribut — la touche
// reste enfoncée, sa face devient sombre et son voyant s'allume (pas seulement une couleur).
export default function LienNav({ href, className, children, "aria-label": libelle }: Props) {
  const chemin = usePathname();
  const actif = href === "/" ? chemin === "/" : chemin.startsWith(href);
  return (
    <Link href={href} aria-current={actif ? "page" : undefined} aria-label={libelle} className={className}>
      {children}
    </Link>
  );
}
