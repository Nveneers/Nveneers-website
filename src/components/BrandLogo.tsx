import Image from "next/image";
import type { BrandContent } from "@/content/home/types";

export default function BrandLogo({ brand, className = "w-36", priority = false }: { brand?: BrandContent; className?: string; priority?: boolean }) {
  const alt = brand?.logoAlt ?? "Nveneer — Non prep veneer";
  return (
    <span className={`relative inline-block shrink-0 ${className}`} dir="ltr">
      <Image src={brand?.logoFull ?? "/images/brand/logo-full.svg"} alt={alt} width={859} height={187} className="brand-logo-light h-auto w-full" priority={priority} />
      <Image src={brand?.logoDark ?? "/images/brand/logo-full-dark.svg"} alt={alt} width={859} height={187} className="brand-logo-dark h-auto w-full" priority={priority} />
    </span>
  );
}
