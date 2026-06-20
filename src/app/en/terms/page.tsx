import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { getLegalContent } from "@/content/legal";

export const metadata: Metadata = {
  title: "Terms of Use | Non Prep Veneers"
};

export default function Page() {
  return <LegalPage locale="en" content={getLegalContent("en", "terms")} />;
}
