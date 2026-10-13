import { RailNav } from "@/components/site/rail-nav";
import { SiteFooter } from "@/components/site/site-footer";

/** Public shell: nav + footer, no auth requirement. */
export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <RailNav />
      {children}
      <SiteFooter />
    </>
  );
}