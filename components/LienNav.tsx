"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  href: string;
  className: string;
  children: React.ReactNode;
  "aria-label"?: string;
};

// ch. 10 — usePathname : la page courante est surlignée (aria-current="page", pilule pleine de
// l'accent dans la direction « Album »), pas seulement par la couleur : graisse et fond changent.
export default function LienNav({ href, className, children, "aria-label": libelle }: Props) {
  const chemin = usePathname();
  const actif = href === "/" ? chemin === "/" : chemin.startsWith(href);
  return (
    <Link
      href={href}
      aria-current={actif ? "page" : undefined}
      aria-label={libelle}
      className={`${className} aria-[current=page]:bg-pokedex aria-[current=page]:text-white`}
    >
      {children}
    </Link>
  );
}
