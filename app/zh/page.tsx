import { PageShell } from "@/components/PageShell";
import { buildPageMetadata } from "@/lib/i18n/page-meta";

export const metadata = buildPageMetadata("zh");

export default function HomePageZh() {
  return <PageShell locale="zh" />;
}
