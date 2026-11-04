import { jsonLdString } from "@/lib/seo";

/** Renders one or more JSON-LD objects as a structured-data script tag. */
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(data) }} />;
}
