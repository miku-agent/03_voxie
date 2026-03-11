import Link from "next/link";
import { getCardBySlugAsync, getCardExternalLinks } from "@/lib/cards";
import { listDecks } from "@/lib/decks";

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
              목록으로
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const links = getCardExternalLinks(card);
  const decks = await listDecks();
  const relatedDecks = decks.filter((deck) => deck.cards.includes(card.slug));

  return (
    <div className="min-h-screen text-white">
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <header className="terminal-shell p-5 sm:p-6">
          <Link className="text-sm text-[var(--terminal-muted)]" href="/">
            ← 카드 목록
          </Link>
          <div className="mt-4 grid gap-6 md:grid-cols-[minmax(0,1fr)_280px]">
            <div>
              <div className="dense-meta">
                <span>{card.character}</span>
                <span>{card.type}</span>
                {card.producer && <span>{card.producer}</span>}
                {card.year && <span>{card.year}</span>}
              </div>
              <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{card.title}</h1>
              {card.summary && (
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--terminal-soft)] sm:text-base">
                  {card.summary}
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {card.tags.map((item) => (
                  <span key={item} className="terminal-chip">
                    #{item}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {relatedDecks.length > 0 && (
                  <Link className="terminal-button" href={`/decks/${relatedDecks[0].slug}`}>
                    관련 덱 보기
                  </Link>
                )}
                <a href={links.youtubeSearch} target="_blank" rel="noreferrer" className="terminal-button">
                  YouTube 검색
                </a>
              </div>
            </div>

            <aside className="terminal-frame p-4">
              <p className="text-sm font-semibold">카드 정보</p>
              <div className="mt-3 space-y-3 text-sm">
                <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                  <span className="text-[var(--terminal-muted)]">캐릭터</span>
                  <span>{card.character}</span>
                </div>
                {card.producer && (
                  <div className="flex items-center justify-between gap-4 border border-[var(--terminal-border)] px-3 py-2">
                    <span className="text-[var(--terminal-muted)]">프로듀서</span>
                    <span className="text-right">{card.producer}</span>
                  </div>
                )}
                {card.year && (
                  <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                    <span className="text-[var(--terminal-muted)]">연도</span>
                    <span>{card.year}</span>
                  </div>
                )}
                {card.era && (
                  <div className="flex items-center justify-between gap-4 border border-[var(--terminal-border)] px-3 py-2">
                    <span className="text-[var(--terminal-muted)]">시기</span>
                    <span className="text-right">{card.era}</span>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="terminal-frame p-5 sm:p-6">
            <h2 className="text-lg font-semibold">설명</h2>
            {card.description ? (
              <div className="mt-4 space-y-4 text-sm leading-7 text-[var(--terminal-soft)]">
                {card.description.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-[var(--terminal-muted)]">아직 등록된 설명이 없어요.</p>
            )}

            {card.whyItMatters && (
              <div className="mt-6 border border-[var(--terminal-border)] px-4 py-4">
                <p className="text-sm font-semibold text-[var(--terminal-fg)]">왜 이 카드가 중요한가</p>
                <p className="mt-3 text-sm leading-7 text-[var(--terminal-soft)]">{card.whyItMatters}</p>
              </div>
            )}

            <div className="mt-6">
              <p className="text-sm font-semibold text-[var(--terminal-fg)]">무드</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(card.mood ?? card.tags).map((item) => (
                  <span key={item} className="terminal-chip" data-active="true">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </article>

          <aside className="space-y-6">
            <section className="terminal-frame p-5">
              <h2 className="text-lg font-semibold">바로 가기</h2>
              <div className="mt-4 flex flex-col gap-3 text-sm">
                {links.source && (
                  <a href={links.source} target="_blank" rel="noreferrer" className="terminal-button text-center">
                    원문 보기
                  </a>
                )}
                <a href={links.youtubeSearch} target="_blank" rel="noreferrer" className="terminal-button text-center">
                  YouTube 검색
                </a>
                <a href={links.niconicoSearch} target="_blank" rel="noreferrer" className="terminal-button text-center">
                  니코동 검색
                </a>
              </div>
            </section>

            <section className="terminal-frame p-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold">포함된 덱</h2>
                <Link href="/decks" className="text-sm text-[var(--terminal-soft)]">
                  전체 보기 →
                </Link>
              </div>
              <div className="mt-4 space-y-3">
                {relatedDecks.length > 0 ? (
                  relatedDecks.map((deck) => (
                    <Link key={deck.slug} href={`/decks/${deck.slug}`} className="block border border-[var(--terminal-border)] px-4 py-4">
                      <p className="text-sm font-semibold">{deck.name}</p>
                      <p className="mt-1 text-sm leading-6 text-[var(--terminal-muted)]">
                        {deck.shortPitch ?? deck.description}
                      </p>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-[var(--terminal-muted)]">아직 이 카드를 담은 덱이 없어요.</p>
                )}
              </div>
            </section>
          </aside>
        </section>
      </main>
    </div>
  );
}
