"use client";

import { useEffect, useState } from "react";

/** Keep navigation legible as the hero's lower edge passes behind the header. */
export default function useHeroHeader() {
  const [overHero, setOverHero] = useState(true);
  useEffect(() => {
    const hero = document.getElementById("home-hero");
    if (!hero) { setOverHero(false); return; }
    const observer = new IntersectionObserver(([entry]) => {
      setOverHero(entry.isIntersecting || entry.boundingClientRect.top > 0);
    }, { rootMargin: "-96px 0px 0px 0px" });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);
  return overHero;
}
