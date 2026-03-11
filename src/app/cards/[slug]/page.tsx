import Link from "next/link";
import { getCardBySlugAsync } from "@/lib/cards";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CardDetail({ params }: Props) {
  const { slug } = await params;
  const card = await getCardBySlugAsync(slug);

  if (!card) {
    return (
      <div className="min-h-screen bg-black text-white">
        <main className="mx-auto max-w-3xl px-6 py-12">
          <p className="text-sm text-[var(--terminal-muted)]">카드를 찾을 수 없어요.</p>
          <Link className="mt-6 inline-flex text-[var(--terminal-fg)]" href="/">
            ← 목록으로
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-4xl px-6 py-12">
        <Link className="text-sm text-[var(--terminal-fg)]" href="/">
          ← 목록으로
        </Link>

        <article className="mt-8 terminal-frame p-6">
          <div className="flex items-center justify-between text-xs text-[var(--terminal-muted)]">
            <span>{card.character}</span>
            <span className="uppercase">{card.type}</span>
          </div>
          <h1 className="mt-4 text-2xl font-semibold">{card.title}</h1>

          <div className="mt-6 flex flex-wrap gap-2">
            {card.tags.map((item) => (
              <span
                key={item}
                className="border border-[var(--terminal-border)] px-2 py-0.5 text-[10px] text-[var(--terminal-muted)]"
              >
                #{item}
              </span>
            ))}
          </div>

          {card.source_url && (
            <a
              href={card.source_url}
              className="mt-6 inline-flex text-xs text-[var(--terminal-fg)]"
              target="_blank"
              rel="noreferrer"
            >
              출처 보기
            </a>
          )}
        </article>
      </main>
    </div>
  );
}
