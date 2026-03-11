import Link from "next/link";
import { getCardBySlug } from "@/lib/cards";

type Props = {
  params: { slug: string };
};

export default function CardDetail({ params }: Props) {
  const card = getCardBySlug(params.slug);

  if (!card) {
    return (
      <div className="min-h-screen bg-black text-white">
        <main className="mx-auto max-w-3xl px-6 py-12">
          <p className="text-sm text-zinc-400">카드를 찾을 수 없어요.</p>
          <Link className="mt-6 inline-flex text-emerald-300" href="/">
            ← 목록으로
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-4xl px-6 py-12">
        <Link className="text-sm text-emerald-300" href="/">
          ← 목록으로
        </Link>

        <article className="mt-8 rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>{card.character}</span>
            <span className="uppercase">{card.type}</span>
          </div>
          <h1 className="mt-4 text-2xl font-semibold">{card.title}</h1>

          <div className="mt-6 flex flex-wrap gap-2">
            {card.tags.map((item) => (
              <span
                key={item}
                className="rounded-full border border-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400"
              >
                #{item}
              </span>
            ))}
          </div>

          {card.source_url && (
            <a
              href={card.source_url}
              className="mt-6 inline-flex text-xs text-emerald-300"
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
