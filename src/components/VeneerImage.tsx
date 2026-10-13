type VeneerImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  eager?: boolean;
};

/** Pre-sized WebP assets avoid generating AVIF variants during a visitor's request. */
export default function VeneerImage({ src, alt, sizes, className = "", eager = false }: VeneerImageProps) {
  const macro = src.endsWith("/veneer-macro.webp");
  const resized = (width: number) => src.replace(/\.webp$/, `-${width}w.webp`);
  const sources = [480, 800, ...(macro ? [1200] : [])].map(width => `${resized(width)} ${width}w`);
  const largestWidth = macro ? 1440 : 1100;
  sources.push(`${resized(largestWidth)} ${largestWidth}w`);

  return (
    // These assets are optimized ahead of time and served with a responsive srcset.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resized(800)}
      srcSet={sources.join(", ")}
      sizes={sizes}
      alt={alt}
      width={macro ? 1440 : 1100}
      height={macro ? 960 : 1100}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={`absolute inset-0 h-full w-full ${className}`}
    />
  );
}
