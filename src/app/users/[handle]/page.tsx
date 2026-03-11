import Link from "next/link";
import { notFound } from "next/navigation";
import { listCards } from "@/lib/cards";
import { listDecks } from "@/lib/decks";
import { getProfileByHandle } from "@/lib/profiles";
import { getProfileSocialMeta } from "@/lib/social";
import FollowCuratorButton from "./FollowCuratorButton";

type Props = {
  params: Promise<{ handle: string }>;
};

export default async function UserProfilePage({ params }: Props) {
  const { handle } = await params;
  const profile = getProfileByHandle(handle);

  if (!profile) notFound();

  const [cards, decks] = await Promise.all([listCards(), listDecks()]);
  const authoredCards = cards.filter((card) => card.authorHandle === handle);
  const authoredDecks = decks.filter((deck) => deck.authorHandle === handle);
  const social = getProfileSocialMeta(handle);

  return (
    <div className="min-h-screen text-white">
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <header className="terminal-shell p-5 sm:p-6">
          <Link className="text-sm text-[var(--terminal-muted)]" href="/">
            ← 홈으로
          </Link>
          <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_240px] md:gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--terminal-muted)]">profile</p>
              <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{profile.name}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--terminal-soft)]">{profile.bio}</p>
              <div className="dense-meta mt-4">
                <span>@{profile.handle}</span>
                <span>{authoredCards.length} cards</span>
                <span>{authoredDecks.length} decks</span>
                <span>{social.followers} followers</span>
              </div>
              <FollowCuratorButton name={profile.name} initialFollowers={social.followers} />
            </div>

            <aside className="terminal-frame p-4">
              <p className="text-sm font-semibold">활동 요약</p>
              <div className="mt-3 space-y-3 text-sm">
                <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                  <span className="text-[var(--terminal-muted)]">작성 카드</span>
                  <span>{authoredCards.length}</span>
                </div>
                <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                  <span className="text-[var(--terminal-muted)]">작성 덱</span>
                  <span>{authoredDecks.length}</span>
                </div>
                <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                  <span className="text-[var(--terminal-muted)]">팔로워</span>
                  <span>{social.followers}</span>
                </div>
              </div>
            </aside>
          </div>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="terminal-frame p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">작성한 카드</h2>
              <Link href="/" className="text-sm text-[var(--terminal-soft)]">전체 카드 →</Link>
            </div>
            <div className="mt-4 space-y-3">
              {authoredCards.length > 0 ? authoredCards.map((card) => (
                <Link key={card.slug} href={`/cards/${card.slug}`} className="block border border-[var(--terminal-border)] px-4 py-4">
                  <div className="flex items-center justify-between gap-3 text-xs text-[var(--terminal-muted)]">
                    <span>{card.character}</span>
                    <span className="uppercase">{card.type}</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold">{card.title}</p>
                  {card.summary && <p className="mt-1 text-sm leading-6 text-[var(--terminal-muted)]">{card.summary}</p>}
                </Link>
              )) : <div className="border border-[var(--terminal-border)] px-4 py-4 text-sm text-[var(--terminal-muted)]">아직 공개된 카드가 없어요.</div>}
            </div>
          </article>

          <article className="terminal-frame p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">작성한 덱</h2>
              <Link href="/decks" className="text-sm text-[var(--terminal-soft)]">전체 덱 →</Link>
            </div>
            <div className="mt-4 space-y-3">
              {authoredDecks.length > 0 ? authoredDecks.map((deck) => (
                <Link key={deck.slug} href={`/decks/${deck.slug}`} className="block border border-[var(--terminal-border)] px-4 py-4">
                  <div className="flex items-center justify-between gap-3 text-xs text-[var(--terminal-muted)]">
                    <span>{deck.cards.length} cards</span>
                    <span>{deck.featured ? "featured" : "deck"}</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold">{deck.name}</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--terminal-muted)]">{deck.shortPitch ?? deck.description}</p>
                </Link>
              )) : <div className="border border-[var(--terminal-border)] px-4 py-4 text-sm text-[var(--terminal-muted)]">아직 공개된 덱이 없어요.</div>}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
