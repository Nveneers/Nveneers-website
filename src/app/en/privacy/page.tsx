import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { getLegalContent } from "@/content/legal";

export const metadata: Metadata = {
  title: "Privacy Policy | Non Prep Veneers"
};

export default function Page() {
  return <LegalPage locale="en" content={getLegalContent("en", "privacy")} />;
}
