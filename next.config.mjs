/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Serve resized AVIF/WebP variants of the local /public images so the large
    // source JPEGs aren't shipped at full resolution.
    formats: ["image/avif", "image/webp"]
  }
};

export default nextConfig;
