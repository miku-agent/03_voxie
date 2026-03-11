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
      <div className="min-h-screen text-white">
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="terminal-shell px-6 py-10">
            <p className="text-sm text-[var(--terminal-muted)]">카드를 찾을 수 없어요.</p>
            <Link className="mt-6 inline-flex terminal-button" href="/">
              [ 목록으로 ]
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="terminal-shell overflow-hidden">
          <div className="terminal-titlebar">
            <span>card://{card.slug}</span>
            <span>{card.type.toUpperCase()}</span>
          </div>
          <div className="grid gap-6 px-5 py-6 sm:px-8 sm:py-8 md:grid-cols-[minmax(0,1fr)_280px]">
            <div>
              <Link className="text-xs uppercase tracking-[0.16em] text-[var(--terminal-muted)] hover:text-[var(--terminal-fg)]" href="/">
                ← return --cards
              </Link>
              <h1 className="mt-4 text-3xl font-semibold uppercase tracking-[0.12em] sm:text-4xl">
                {card.title}
              </h1>
              <div className="mt-4 flex flex-wrap gap-2">
                {card.tags.map((item) => (
                  <span key={item} className="terminal-chip">
                    #{item}
                  </span>
                ))}
              </div>
            </div>

            <aside className="terminal-frame p-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                  <span className="text-[var(--terminal-muted)]">character</span>
                  <span>{card.character}</span>
                </div>
                <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                  <span className="text-[var(--terminal-muted)]">type</span>
                  <span>{card.type}</span>
                </div>
                <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                  <span className="text-[var(--terminal-muted)]">tags</span>
                  <span>{card.tags.length}</span>
                </div>
              </div>
            </aside>
          </div>
        </header>

        <section className="mt-8 terminal-frame p-5 sm:p-6">
          <div className="text-xs uppercase tracking-[0.16em] text-[var(--terminal-muted)]">source</div>
          {card.source_url ? (
            <a
              href={card.source_url}
              className="mt-4 inline-flex terminal-button text-xs"
              target="_blank"
              rel="noreferrer"
            >
              [ source --open ]
            </a>
          ) : (
            <p className="mt-4 text-sm text-[var(--terminal-muted)]">등록된 출처 링크가 없어요.</p>
          )}
        </section>
      </main>
    </div>
  );
}
