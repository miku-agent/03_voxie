import Link from "next/link";
import {
  getCardBySlugAsync,
  getCardExternalLinks,
  getCardMediaMeta,
  getYouTubeEmbedUrl,
} from "@/lib/cards";
import { listDecks } from "@/lib/decks";
import { getProfileHref } from "@/lib/profiles";

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
  const embedUrl = getYouTubeEmbedUrl(card.youtube_url);
  const media = getCardMediaMeta(card);
  const decks = await listDecks();
  const relatedDecks = decks.filter((deck) => deck.cards.includes(card.slug));

  return (
    <div className="min-h-screen text-white">
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <header className="terminal-shell p-5 sm:p-6">
          <Link className="text-sm text-[var(--terminal-muted)]" href="/">
            ← 카드 목록
          </Link>
          <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_280px] md:gap-6">
            <div>
              <div className="dense-meta">
                <span>{card.character}</span>
                <span>{card.type}</span>
                {card.producer && <span>{card.producer}</span>}
                {card.year && <span>{card.year}</span>}
              </div>
              <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{card.title}</h1>
              {card.summary && (
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--terminal-soft)] sm:text-base">{card.summary}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {card.tags.map((item) => (
                  <span key={item} className="terminal-chip">
                    #{item}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                {card.authorName && card.authorHandle ? (
                  <Link className="terminal-button w-full sm:w-auto" href={getProfileHref(card.authorHandle)!}>
                    작성자 {card.authorName}
                  </Link>
                ) : (
                  <span className="inline-flex items-center text-sm text-[var(--terminal-muted)]">작성자 정보 없음</span>
                )}
                {relatedDecks.length > 0 && (
                  <Link className="terminal-button w-full sm:w-auto" href={`/decks/${relatedDecks[0].slug}`}>
                    관련 덱 보기
                  </Link>
                )}
                {embedUrl && (
                  <a href="#video" className="terminal-button w-full sm:w-auto">
                    영상 바로 보기
                  </a>
                )}
                <a href={links.youtubeSearch} target="_blank" rel="noreferrer" className="terminal-button w-full sm:w-auto">
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
                <div className="flex items-center justify-between gap-4 border border-[var(--terminal-border)] px-3 py-2">
                  <span className="text-[var(--terminal-muted)]">작성자</span>
                  {card.authorName && card.authorHandle ? (
                    <Link href={getProfileHref(card.authorHandle)!} className="text-right underline-offset-4 hover:underline">
                      {card.authorName}
                    </Link>
                  ) : (
                    <span className="text-right text-[var(--terminal-muted)]">unknown</span>
                  )}
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
                <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                  <span className="text-[var(--terminal-muted)]">연결된 덱</span>
                  <span>{relatedDecks.length}</span>
                </div>
                <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                  <span className="text-[var(--terminal-muted)]">영상</span>
                  <span>{embedUrl ? "있음" : "없음"}</span>
                </div>
                {media.videoLabel && (
                  <div className="flex items-center justify-between gap-4 border border-[var(--terminal-border)] px-3 py-2">
                    <span className="text-[var(--terminal-muted)]">영상 소스</span>
                    <span className="text-right">{media.videoLabel}</span>
                  </div>
                )}
                {media.sourceLabel && (
                  <div className="flex items-center justify-between gap-4 border border-[var(--terminal-border)] px-3 py-2">
                    <span className="text-[var(--terminal-muted)]">원문 소스</span>
                    <span className="text-right">{media.sourceLabel}</span>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="terminal-frame p-5 sm:p-6">
            {embedUrl && (
              <section id="video" className="mb-8">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <h2 className="text-lg font-semibold">영상</h2>
                  {links.youtube && (
                    <a href={links.youtube} target="_blank" rel="noreferrer" className="text-sm text-[var(--terminal-soft)]">
                      원본 열기 ↗
                    </a>
                  )}
                </div>
                <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
                  {media.youtubeThumbnailUrl && (
                    <a
                      href={links.youtube}
                      target="_blank"
                      rel="noreferrer"
                      className="overflow-hidden border border-[var(--terminal-border)] bg-black"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={media.youtubeThumbnailUrl} alt={`${card.title} thumbnail`} className="aspect-video h-full w-full object-cover" />
                    </a>
                  )}
                  <div className="space-y-3">
                    <div className="overflow-hidden border border-[var(--terminal-border)] bg-black">
                      <div className="relative aspect-video w-full">
                        <iframe
                          src={embedUrl}
                          title={`${card.title} YouTube player`}
                          className="absolute inset-0 h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="border border-[var(--terminal-border)] px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.12em] text-[var(--terminal-muted)]">preview</p>
                        <p className="mt-2 text-sm leading-6 text-[var(--terminal-soft)]">
                          텍스트 링크 대신 썸네일과 임베드로 바로 맥락을 파악할 수 있어요.
                        </p>
                      </div>
                      <div className="border border-[var(--terminal-border)] px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.12em] text-[var(--terminal-muted)]">source metadata</p>
                        <p className="mt-2 text-sm leading-6 text-[var(--terminal-soft)]">
                          영상 소스 {media.videoLabel ?? "unknown"}
                          {media.sourceLabel ? ` · 원문 소스 ${media.sourceLabel}` : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

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
              {media.hasSourceMeta && (
                <div className="mt-4 grid gap-3 text-sm">
                  <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                    <span className="text-[var(--terminal-muted)]">영상 소스</span>
                    <span>{media.videoLabel ?? "unknown"}</span>
                  </div>
                  {media.sourceLabel && (
                    <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                      <span className="text-[var(--terminal-muted)]">원문 소스</span>
                      <span>{media.sourceLabel}</span>
                    </div>
                  )}
                </div>
              )}
              <div className="mt-4 flex flex-col gap-3 text-sm">
                {links.source && (
                  <a href={links.source} target="_blank" rel="noreferrer" className="terminal-button text-center">
                    원문 보기
                  </a>
                )}
                {links.youtube && (
                  <a href={links.youtube} target="_blank" rel="noreferrer" className="terminal-button text-center">
                    YouTube 원본
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
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold">{deck.name}</p>
                        <span className="text-xs text-[var(--terminal-muted)]">{deck.cards.length} cards</span>
                      </div>
                      <div className="mt-2 text-xs text-[var(--terminal-muted)]">
                        {deck.authorName && deck.authorHandle ? `by ${deck.authorName}` : "author unknown"}
                      </div>
                      <p className="mt-1 text-sm leading-6 text-[var(--terminal-muted)]">{deck.shortPitch ?? deck.description}</p>
                    </Link>
                  ))
                ) : (
                  <div className="border border-[var(--terminal-border)] px-4 py-4 text-sm text-[var(--terminal-muted)]">
                    아직 이 카드를 담은 덱이 없어요. 덱을 새로 만들어 이 카드를 중심으로 묶을 수 있어요.
                  </div>
                )}
              </div>
            </section>
          </aside>
        </section>
      </main>
    </div>
  );
}
