import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Add your licensed Subjectivity Serif file at public/fonts/subjectivity.regular.otf.
const subjectivity = localFont({
  src: [
    {
      path: "../../public/fonts/subjectivity.regular.otf",
      weight: "400",
      style: "normal"
    }
  ],
  variable: "--font-subjectivity",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Non Prep Veneers | Premium Smile Design",
  description:
    "Discover non prep veneers with a premium, clinically guided approach. See real cases, eligibility guidance, and a free assessment coming soon.",
  openGraph: {
    title: "Non Prep Veneers | Premium Smile Design",
    description:
      "Ultra-thin veneers with minimal alteration, delivered with clinical precision and honest guidance.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${subjectivity.variable} font-brand antialiased`}>
        {children}
      </body>
    </html>
  );
}
