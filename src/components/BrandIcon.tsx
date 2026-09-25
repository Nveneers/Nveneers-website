const paths: Record<string, string> = {
  brush: "M7 14 4 21m3-7 3 1 7-11-5-2-5 12Zm5-9 4 2m-5 1 3 2m-4 1 3 2",
  floss: "M6 3v6a6 6 0 0 0 12 0V3M6 6h12M12 15v7",
  calendar: "M7 3v4m10-4v4M4 10h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Zm4 10 2 2 4-4",
  food: "M12 3 3 8v10l9 4 9-4V8l-9-5Zm-9 5 9 5 9-5M12 13v9",
  guard: "M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6l-8-3ZM8 12l3 3 5-6"
};
export default function BrandIcon({ name }: { name: string }) {
  return <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-accent-soft text-brand-accent"><svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] ?? paths.guard} /></svg></span>;
}
