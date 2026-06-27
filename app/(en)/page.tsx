import { PageShell } from "@/components/PageShell";
import { buildPageMetadata } from "@/lib/i18n/page-meta";

export const metadata = buildPageMetadata("en");

export default function HomePage() {
  return <PageShell locale="en" />;
}
