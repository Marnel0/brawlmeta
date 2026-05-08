"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/tier-list", label: "Tier list" },
  { href: "/maps", label: "Maps" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-brand-cream border-b-2 border-brand-ink">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-2xl tracking-wide text-brand-ink hover:text-brand-yellow transition-colors duration-150"
        >
          BrawlMeta
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-3">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-xl border-2 border-brand-ink font-bold text-sm transition-all duration-150",
                  active
                    ? "bg-brand-yellow shadow-cartoon-pressed translate-x-[2px] translate-y-[2px]"
                    : "bg-brand-paper shadow-cartoon-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-cartoon-pressed"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
