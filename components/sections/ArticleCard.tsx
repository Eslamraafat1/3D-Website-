import Link from "next/link";
import { num, type Locale } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n/dictionaries";
import type { ArticleView } from "@/lib/data/types";
import ArchArt from "@/components/art/ArchArt";
import Reveal from "@/components/ui/Reveal";

export default function ArticleCard({
  article, lang, dict, className = "", aspect = "aspect-[4/3]", delay = 0, large = false,
}: {
  article: ArticleView; lang: Locale; dict: Dict; className?: string; aspect?: string; delay?: number; large?: boolean;
}) {
  return (
    <Reveal as="article" delay={delay} className={className}>
      <Link href={`/${lang}/journal/${article.slug}`} className="group block">
        <div className={`overflow-hidden ${aspect}`}>
          <ArchArt art={article.art} label={article.title} className="h-full w-full transition-transform duration-[1400ms] ease-[var(--ease)] group-hover:scale-[1.04]" />
        </div>
        <p className="mono mt-4 flex flex-wrap gap-x-4 text-fg-2">
          <span className="text-accent-text">{article.categoryLabel}</span>
          <time dateTime={article.publishedAt}>{article.dateLabel}</time>
          <span>{num(article.readingTime, lang)} {dict.common.minutesRead}</span>
        </p>
        <h3 className={`display mt-3 ${large ? "text-[clamp(2.4rem,5vw,4.8rem)]" : "text-[clamp(1.7rem,2.6vw,2.5rem)]"} leading-[1]`}>
          <span className="link-u">{article.title}</span>
        </h3>
        <p className="mt-4 max-w-[48ch] text-fg-2">{article.excerpt}</p>
      </Link>
    </Reveal>
  );
}
