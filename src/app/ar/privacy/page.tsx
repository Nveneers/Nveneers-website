import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { getLegalContent } from "@/content/legal";

export const metadata: Metadata = {
  title: "سياسة الخصوصية | فينير بدون برد"
};

export default function Page() {
  return <LegalPage locale="ar" content={getLegalContent("ar", "privacy")} />;
}
