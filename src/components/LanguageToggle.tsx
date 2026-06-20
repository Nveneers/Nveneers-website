"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

type LanguageToggleProps = {
  // Destination locale path, e.g. "/ar" or "/en".
  href: string;
  label: string;
  ariaLabel: string;
  className?: string;
  children?: ReactNode;
  // Called after navigation is triggered (e.g. to close the mobile menu).
  onNavigate?: () => void;
};

// Returns the id of the section currently in view, so we can land on the same
// place after switching locale instead of resetting to the top of the page.
function currentSectionId(): string | null {
  if (typeof window === "undefined" || window.scrollY === 0) {
    return null;
  }

  const viewportCenter = window.innerHeight / 2;
  const sections = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));

  let best: { id: string; top: number } | null = null;
  for (const section of sections) {
    const top = section.getBoundingClientRect().top;
    // Closest section whose top has scrolled to/above the viewport center.
    if (top <= viewportCenter && (!best || top > best.top)) {
      best = { id: section.id, top };
    }
  }

  return best?.id ?? null;
}

// Switches language while preserving the reader's place. On click it appends the
// in-view section's hash to the target locale path; LanguageDocument restores the
// scroll position on the new page from that hash.
export default function LanguageToggle({
  href,
  label,
  ariaLabel,
  className,
  children,
  onNavigate
}: LanguageToggleProps) {
  const router = useRouter();

  const handleClick = () => {
    const sectionId = currentSectionId();
    router.push(sectionId ? `${href}#${sectionId}` : href);
    onNavigate?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      aria-label={ariaLabel}
    >
      {children ?? label}
    </button>
  );
}
