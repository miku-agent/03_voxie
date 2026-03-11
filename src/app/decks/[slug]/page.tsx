import type { Metadata } from "next";
import Link from "next/link";
import ShareDeckActions from "./ShareDeckActions";
import { getCardBySlugAsync, type Card } from "@/lib/cards";
import { getDeckShareDescription, getDeckShareUrl } from "@/lib/deck-share";
import { getDeckBySlugAsync } from "@/lib/decks";
import { getProfileHref } from "@/lib/profiles";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ created?: string }>;
};

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { slug } = await params;
  const deck = await getDeckBySlugAsync(slug);

  if (!deck) {
    return {
      title: "덱을 찾을 수 없어요 | Voxie",
      description: "요청한 Voxie 덱을 찾을 수 없어요.",
    };
  }

  const title = `${deck.name} | Voxie`;
  const description = getDeckShareDescription(deck);
  const url = getDeckShareUrl(deck.slug);

  return {
    title,
    description,
    alternates: { canonical: `/decks/${deck.slug}` },
    openGraph: {
      title,
      description,
      url,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function DeckDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  const created = resolvedSearchParams.created;
  const deck = await getDeckBySlugAsync(slug);

  if (!deck) {
    return (
      <div className="min-h-screen text-white">
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="terminal-shell px-6 py-10">
            <p className="text-sm text-[var(--terminal-muted)]">덱을 찾을 수 없어요.</p>
            <Link className="mt-6 inline-flex terminal-button" href="/decks">
              덱 목록으로
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const shareUrl = getDeckShareUrl(deck.slug);
  const cards = (await Promise.all(deck.cards.map((cardSlug) => getCardBySlugAsync(cardSlug)))).filter(
    (card): card is Card => Boolean(card),
  );

  return (
    <div className="min-h-screen text-white">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <header className="terminal-shell p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <Link className="text-sm text-[var(--terminal-muted)]" href="/decks">
              ← 덱 목록
            </Link>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
              <Link className="terminal-button w-full sm:w-auto" href={`/decks/${deck.slug}/edit`}>
                덱 수정
              </Link>
              <Link className="terminal-button w-full sm:w-auto" href="/cards/new">
                카드 추가
              </Link>
            </div>
          </div>

          {created === "deck" && (
            <div className="terminal-notice mt-5">
              덱이 저장됐어요. 이제 카드 구성을 확인하거나 바로 수정해서 큐레이션을 더 다듬을 수 있어요.
            </div>
          )}

          <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_280px] md:gap-6">
            <div>
              <div className="dense-meta">
                <span>{cards.length} cards</span>
                <span>{deck.tags.length} tags</span>
                {deck.featured && <span>featured deck</span>}
              </div>
              <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{deck.name}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--terminal-soft)]">
                {deck.shortPitch ?? deck.description ?? "이 덱은 관련 카드들을 하나의 흐름으로 읽기 위한 큐레이션 단위예요."}
              </p>
              {(deck.introTitle || deck.introBody || deck.intro) && (
                <div className="mt-5 border border-[var(--terminal-border)] bg-[rgba(57,197,187,0.04)] px-4 py-4 sm:px-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--terminal-muted)]">deck intro</p>
                  <h2 className="mt-2 text-xl font-semibold">{deck.introTitle ?? "이 덱을 읽는 방법"}</h2>
                  {(deck.intro ?? deck.introBody) && (
                    <p className="mt-3 text-sm leading-7 text-[var(--terminal-soft)]">{deck.intro ?? deck.introBody}</p>
                  )}
                </div>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {deck.tags.map((tag) => (
                  <span key={tag} className="terminal-chip">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                {deck.authorName && deck.authorHandle ? (
                  <Link className="terminal-button w-full sm:w-auto" href={getProfileHref(deck.authorHandle)!}>
                    작성자 {deck.authorName}
                  </Link>
                ) : (
                  <span className="inline-flex items-center text-sm text-[var(--terminal-muted)]">작성자 정보 없음</span>
                )}
                {cards.length > 0 && (
                  <a className="terminal-button w-full sm:w-auto" href="#story-flow">
                    흐름으로 읽기
                  </a>
                )}
                <a className="terminal-button w-full sm:w-auto" href={shareUrl}>
                  공개 링크 열기
                </a>
              </div>
            </div>

            <aside className="terminal-frame p-4">
              <p className="text-sm font-semibold">덱 상태</p>
              <div className="mt-3 space-y-3 text-sm">
                <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                  <span className="text-[var(--terminal-muted)]">카드 수</span>
                  <span>{cards.length}</span>
                </div>
                <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                  <span className="text-[var(--terminal-muted)]">태그 수</span>
                  <span>{deck.tags.length}</span>
                </div>
                <div className="flex items-center justify-between gap-4 border border-[var(--terminal-border)] px-3 py-2">
                  <span className="text-[var(--terminal-muted)]">작성자</span>
                  {deck.authorName && deck.authorHandle ? (
                    <Link href={getProfileHref(deck.authorHandle)!} className="text-right underline-offset-4 hover:underline">
                      {deck.authorName}
                    </Link>
                  ) : (
                    <span className="text-right text-[var(--terminal-muted)]">unknown</span>
                  )}
                </div>
                {deck.featured && (
                  <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                    <span className="text-[var(--terminal-muted)]">추천 덱</span>
                    <span>예</span>
                  </div>
                )}
                <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                  <span className="text-[var(--terminal-muted)]">읽기 방식</span>
                  <span>ordered story</span>
                </div>
              </div>
            </aside>
          </div>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="terminal-frame p-5 sm:p-6">
            <h2 className="text-lg font-semibold">읽는 가이드</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--terminal-soft)]">
              {deck.readingGuide ?? "카드의 순서를 그대로 따라가며 읽으면 이 덱이 왜 이런 구성을 갖는지 더 잘 보입니다."}
            </p>

            {deck.curatorNote && (
              <div className="mt-6 border border-[var(--terminal-border)] px-4 py-4">
                <p className="text-sm font-semibold text-[var(--terminal-fg)]">큐레이터 메모</p>
                <p className="mt-3 text-sm leading-7 text-[var(--terminal-soft)]">{deck.curatorNote}</p>
              </div>
            )}
          </article>

          <ShareDeckActions title={deck.name} url={shareUrl} />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="terminal-frame p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">이 덱을 공유하는 방법</h2>
                <p className="mt-1 text-sm text-[var(--terminal-muted)]">
                  공개 URL 하나로 바로 열리고, 설명과 카드 흐름이 함께 보여서 외부에서 들어와도 맥락을 바로 이해할 수 있어요.
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="border border-[var(--terminal-border)] px-4 py-4">
                <p className="text-xs text-[var(--terminal-muted)]">01</p>
                <p className="mt-2 text-sm font-semibold">안정적인 공개 URL</p>
                <p className="mt-2 text-sm leading-6 text-[var(--terminal-soft)]">덱 slug 기반 주소라서 다시 공유해도 링크가 흔들리지 않아요.</p>
              </div>
              <div className="border border-[var(--terminal-border)] px-4 py-4">
                <p className="text-xs text-[var(--terminal-muted)]">02</p>
                <p className="mt-2 text-sm font-semibold">복사/공유 CTA</p>
                <p className="mt-2 text-sm leading-6 text-[var(--terminal-soft)]">복사 버튼과 네이티브 공유를 같이 제공해서 모바일/데스크탑 둘 다 대응해요.</p>
              </div>
              <div className="border border-[var(--terminal-border)] px-4 py-4">
                <p className="text-xs text-[var(--terminal-muted)]">03</p>
                <p className="mt-2 text-sm font-semibold">직접 열어도 이해되는 구조</p>
                <p className="mt-2 text-sm leading-6 text-[var(--terminal-soft)]">인트로, 읽는 가이드, story flow가 바로 보여서 링크 랜딩 품질이 좋아져요.</p>
              </div>
            </div>
          </article>

          <aside className="terminal-frame p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">story map</h2>
              <Link href="/decks/new" className="text-sm text-[var(--terminal-soft)]">
                새 덱 →
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {cards.map((card, index) => {
                const note = deck.cardNotes?.[card.slug];
                return (
                  <div key={card.slug} className="border border-[var(--terminal-border)] px-4 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[var(--terminal-fg)]">
                        {String(index + 1).padStart(2, "0")}. {card.title}
                      </p>
                      <span className="text-xs uppercase text-[var(--terminal-muted)]">{card.type}</span>
                    </div>
                    {note?.lead && (
                      <p className="mt-2 text-xs uppercase tracking-[0.12em] text-[var(--terminal-muted)]">{note.lead}</p>
                    )}
                    <p className="mt-2 text-sm leading-6 text-[var(--terminal-muted)]">{note?.note ?? card.summary}</p>
                  </div>
                );
              })}
            </div>
          </aside>
        </section>

        <section id="story-flow" className="mt-8 grid gap-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">스토리 흐름</h2>
              <p className="mt-1 text-sm text-[var(--terminal-muted)]">이 덱에 묶인 카드를 의도된 순서대로 읽는 흐름입니다.</p>
            </div>
            <Link className="text-sm text-[var(--terminal-soft)]" href="/cards/new">
              카드 추가 →
            </Link>
          </div>

          {cards.map((card, index) => {
            const note = deck.cardNotes?.[card.slug];
            return (
              <article key={card.slug} className="terminal-frame p-5 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="dense-meta">
                      <span>#{String(index + 1).padStart(2, "0")}</span>
                      <span>{card.character}</span>
                      <span className="uppercase">{card.type}</span>
                      {card.year && <span>{card.year}</span>}
                    </div>
                    <h3 className="mt-3 text-xl font-semibold sm:text-2xl">
                      <Link href={`/cards/${card.slug}`}>{card.title}</Link>
                    </h3>
                    {note?.lead && <p className="mt-3 text-xs uppercase tracking-[0.14em] text-[var(--terminal-muted)]">{note.lead}</p>}
                    <p className="mt-3 text-sm leading-7 text-[var(--terminal-soft)]">
                      {note?.note ?? card.summary ?? "이 카드에 대한 요약은 아직 없지만, 덱 안에서는 하나의 전환점 역할을 합니다."}
                    </p>
                    {card.summary && note?.note && (
                      <p className="mt-3 text-sm leading-7 text-[var(--terminal-muted)]">카드 요약: {card.summary}</p>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {card.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="terminal-chip">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <aside className="w-full max-w-sm border border-[var(--terminal-border)] px-4 py-4 lg:w-[280px]">
                    <p className="text-sm font-semibold">카드 메타</p>
                    <div className="mt-3 space-y-2 text-sm text-[var(--terminal-muted)]">
                      {card.producer && <div>프로듀서: {card.producer}</div>}
                      <div>작성자: {card.authorName ?? "unknown"}</div>
                      <div>태그: {card.tags.length}</div>
                    </div>
                    <Link className="mt-4 inline-flex text-sm text-[var(--terminal-soft)]" href={`/cards/${card.slug}`}>
                      카드 상세 보기 →
                    </Link>
                  </aside>
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}
