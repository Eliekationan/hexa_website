import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipLink } from "@/components/layout/SkipLink";
import { QuoteAgentWidget } from "@/components/quote-agent/QuoteAgentWidget";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipLink />
      <Header />
      {children}
      <Footer />
      <QuoteAgentWidget />
    </>
  );
}
