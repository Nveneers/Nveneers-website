import LanguageDocument from "@/components/LanguageDocument";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div lang="en" dir="ltr" className="locale-ltr"><LanguageDocument locale="en" />{children}</div>;
}
