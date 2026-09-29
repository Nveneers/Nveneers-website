import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/ThemeProvider";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const formula = localFont({
  src: [
    { path: "../../public/fonts/PPFormula-Light.otf", weight: "300", style: "normal" },
    { path: "../../public/fonts/PPFormula-Medium.otf", weight: "500", style: "normal" },
    { path: "../../public/fonts/PPFormula-Extrabold.otf", weight: "800", style: "normal" }
  ],
  variable: "--font-formula", display: "swap"
});
const ping = localFont({
  src: [
    { path: "../../public/fonts/PingARLT-Hairline.otf", weight: "50", style: "normal" },
    { path: "../../public/fonts/PingARLT-Thin.otf", weight: "100", style: "normal" },
    { path: "../../public/fonts/PingARLT-ExtraLight.otf", weight: "200", style: "normal" },
    { path: "../../public/fonts/PingARLT-Light.otf", weight: "300", style: "normal" },
    { path: "../../public/fonts/PingARLT-Regular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/PingARLT-Medium.otf", weight: "500", style: "normal" },
    { path: "../../public/fonts/PingARLT-Bold.otf", weight: "700", style: "normal" }
  ],
  variable: "--font-arabic", display: "swap", preload: false
});
export const metadata: Metadata = {
  title: "Nveneer | Non prep veneers",
  description: "Discover non prep veneers with a clinically guided approach. Explore real cases, eligibility guidance, and a free smile assessment.",
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }, { url: "/favicon.ico", sizes: "any" }], apple: "/apple-touch-icon.png" },
  openGraph: { title: "Nveneer | Non prep veneers", description: "Ultra-thin veneers with minimal alteration, delivered with clinical precision and honest guidance.", type: "website" }
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeInitScript }} /></head>
      <body className={`${formula.variable} ${ping.variable} font-brand antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
