import NotFoundPage from "@/components/NotFoundPage";

export default function NotFound() {
  return (
    <NotFoundPage
      locale="en"
      eyebrow="Error 404"
      title="We can't find that page."
      description="The link may be broken or the page has moved. Head back to the homepage or start a new assessment."
      primaryCta={{ label: "Return to homepage", href: "/en" }}
      secondaryCta={{ label: "Get assessed", href: "/en#assessment" }}
      supportText="Still need help?"
      supportLink={{ label: "Contact us", href: "/en#contact" }}
    />
  );
}
