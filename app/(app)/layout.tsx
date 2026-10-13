import { RailNav } from "@/components/site/rail-nav";
import { SiteFooter } from "@/components/site/site-footer";

/** Shell for everything behind sign-in. The landing page opts out of this. */
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <RailNav />
      <main className="flex-1 py-12 sm:py-16">{children}</main>
      <SiteFooter />
    </>
  );
}