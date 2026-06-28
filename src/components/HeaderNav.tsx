"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type HeaderNavProps = {
  navigation: { label: string; href: string }[];
};

// Desktop nav with scroll-spy: the link for the section currently in view is
// highlighted in the same gold as the hover state.
export default function HeaderNav({ navigation }: HeaderNavProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const ids = navigation
      .map((item) => item.href)
      .filter((href) => href.startsWith("#"))
      .map((href) => href.slice(1));

    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) {
      return;
    }

    // Recompute from the live geometry of all tracked sections so the highlight
    // clears when the activation line sits on a section with no nav entry (or above
    // the first / below the last tracked section).
    const recompute = () => {
      const centerY = window.innerHeight / 2;
      const active = sections.find((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top <= centerY && rect.bottom > centerY;
      });
      setActiveId(active ? active.id : null);
    };

    // The observer just cheaply triggers recompute as sections cross the center line.
    const observer = new IntersectionObserver(recompute, {
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0
    });

    sections.forEach((section) => observer.observe(section));
    recompute();
    return () => observer.disconnect();
  }, [navigation]);

  return (
    <nav className="absolute left-1/2 flex -translate-x-1/2 items-center gap-8 text-[0.8rem] uppercase tracking-[0.05em]">
      {navigation.map((item) => {
        const isActive = item.href === `#${activeId}`;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "true" : undefined}
            className={`whitespace-nowrap transition hover:text-brand-gold ${
              isActive ? "text-brand-gold" : "text-[var(--muted)]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
