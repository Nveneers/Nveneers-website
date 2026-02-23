import NotFoundPage from "@/components/NotFoundPage";

export default function NotFound() {
  return (
    <NotFoundPage
      locale="ar"
      eyebrow="خطأ 404"
      title="لم نعثر على هذه الصفحة."
      description="قد يكون الرابط غير صحيح أو تم نقل الصفحة. ارجع إلى الصفحة الرئيسية أو ابدأ تقييما جديدا."
      primaryCta={{ label: "العودة للرئيسية", href: "/ar" }}
      secondaryCta={{ label: "ابدأ التقييم", href: "/ar#assessment" }}
      supportText="بحاجة لمساعدة إضافية؟"
      supportLink={{ label: "تواصل معنا", href: "/ar#contact" }}
    />
  );
}
