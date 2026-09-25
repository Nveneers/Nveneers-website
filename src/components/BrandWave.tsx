import { useId } from "react";

// A continuous loop echoes the outlined shapes in the supplied identity.
export default function BrandWave({ className = "" }: { className?: string }) {
  const id = `wave-${useId().replace(/:/g, "")}`;
  return (
    <svg className={`brand-wave ${className}`} viewBox="0 0 1440 620" fill="none" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs><linearGradient id={id} x1="30" y1="460" x2="1390" y2="130" gradientUnits="userSpaceOnUse"><stop stopColor="#00c6ff"/><stop offset="1" stopColor="#2c51f4"/></linearGradient></defs>
      <path d="M-90 475C95 475 125 139 326 167C487 189 472 472 639 453C813 433 734 98 928 111C1117 124 898 476 1104 468C1246 462 1274 287 1530 295" stroke={`url(#${id})`} strokeWidth="42" strokeLinecap="round" />
    </svg>
  );
}
