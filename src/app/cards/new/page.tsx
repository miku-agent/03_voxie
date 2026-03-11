"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  buildCardPayload,
  CardFormInput,
  validateCardPayload,
} from "@/lib/card-form";
import { createCard } from "@/lib/actions/cards";

const initialState: CardFormInput = {
  title: "",
  character: "",
  type: "song",
  tags: "",
  sourceUrl: "",
};

const typeOptions = [
  { value: "song", label: "곡" },
  { value: "moment", label: "모먼트" },
  { value: "performance", label: "퍼포먼스" },
  { value: "mv", label: "MV" },
];

export default function CardCreatePage() {
  const router = useRouter();
  const [form, setForm] = useState<CardFormInput>(initialState);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onChange =
    (key: keyof CardFormInput) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
      setSubmitError(null);
    };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = buildCardPayload(form);
    const missing = validateCardPayload(payload);
    setErrors(missing);

    if (missing.length === 0) {
      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const result = await createCard(payload);

        if (result.success) {
          router.push("/");
        } else {
          setSubmitError(result.error || "Failed to create card");
        }
      } catch (error) {
        console.error("Failed to create card:", error);
        setSubmitError("An unexpected error occurred");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen text-white">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <header className="terminal-shell p-5 sm:p-6">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_280px]">
            <div>
              <Link className="text-sm text-[var(--terminal-muted)]" href="/">
                ← 카드 목록
              </Link>
              <h1 className="mt-4 text-3xl font-semibold">카드 추가</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--terminal-muted)]">
                곡이나 장면 하나를 카드로 남깁니다. 최소 정보만 빠르게 입력하고, 나중에 덱으로 묶을 수 있어요.
              </p>
            </div>
            <aside className="terminal-frame p-4">
              <p className="text-sm font-semibold">입력 가이드</p>
              <ul className="mt-3 space-y-2 text-sm text-[var(--terminal-muted)]">
                <li>• 제목, 캐릭터, 태그는 필수예요.</li>
                <li>• 태그는 쉼표로 구분해 입력해요.</li>
                <li>• 출처 링크는 있으면 나중에 탐색이 쉬워져요.</li>
              </ul>
            </aside>
          </div>
        </header>

        <form onSubmit={onSubmit} className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="terminal-frame space-y-6 p-5 sm:p-6">
            <section>
              <h2 className="text-lg font-semibold">기본 정보</h2>
              <div className="mt-4 grid gap-6 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm text-[var(--terminal-soft)]">제목</label>
                  <input
                    value={form.title}
                    onChange={onChange("title")}
                    className="w-full border border-[var(--terminal-border)] bg-[var(--terminal-bg)] px-3 py-3 text-sm text-[var(--terminal-fg)]"
                    placeholder="예: Melt"
                  />
                  {errors.includes("title") && (
                    <p className="text-xs text-[var(--terminal-error)]">제목을 입력해줘.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[var(--terminal-soft)]">캐릭터</label>
                  <input
                    value={form.character}
                    onChange={onChange("character")}
                    className="w-full border border-[var(--terminal-border)] bg-[var(--terminal-bg)] px-3 py-3 text-sm text-[var(--terminal-fg)]"
                    placeholder="예: Hatsune Miku"
                  />
                  {errors.includes("character") && (
                    <p className="text-xs text-[var(--terminal-error)]">캐릭터를 입력해줘.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[var(--terminal-soft)]">타입</label>
                  <select
                    value={form.type}
                    onChange={onChange("type")}
                    className="w-full border border-[var(--terminal-border)] bg-[var(--terminal-bg)] px-3 py-3 text-sm text-[var(--terminal-fg)]"
                  >
                    {typeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.includes("type") && (
                    <p className="text-xs text-[var(--terminal-error)]">타입을 입력해줘.</p>
                  )}
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold">분류 정보</h2>
              <div className="mt-4 space-y-2">
                <label className="text-sm text-[var(--terminal-soft)]">태그</label>
                <input
                  value={form.tags}
                  onChange={onChange("tags")}
                  className="w-full border border-[var(--terminal-border)] bg-[var(--terminal-bg)] px-3 py-3 text-sm text-[var(--terminal-fg)]"
                  placeholder="예: classic, romance, live"
                />
                <p className="text-xs text-[var(--terminal-muted)]">
                  여러 태그는 쉼표(,)로 구분해 주세요.
                </p>
                {errors.includes("tags") && (
                  <p className="text-xs text-[var(--terminal-error)]">태그를 하나 이상 입력해줘.</p>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold">참고 링크</h2>
              <div className="mt-4 space-y-2">
                <label className="text-sm text-[var(--terminal-soft)]">출처 링크</label>
                <input
                  value={form.sourceUrl}
                  onChange={onChange("sourceUrl")}
                  className="w-full border border-[var(--terminal-border)] bg-[var(--terminal-bg)] px-3 py-3 text-sm text-[var(--terminal-fg)]"
                  placeholder="https://..."
                />
                <p className="text-xs text-[var(--terminal-muted)]">
                  공식 링크나 참고 아카이브 주소가 있다면 함께 저장할 수 있어요.
                </p>
              </div>
            </section>

            <div className="flex flex-wrap items-center gap-3 border-t border-[var(--terminal-border)] pt-6">
              <button
                type="submit"
                className="terminal-button disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "저장 중..." : "카드 저장"}
              </button>
              <Link className="terminal-button" href="/">
                취소
              </Link>
            </div>

            {submitError && <p className="text-xs text-[var(--terminal-error)]">{submitError}</p>}
          </div>

          <aside className="terminal-frame p-5">
            <h2 className="text-lg font-semibold">미리 체크</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                <span className="text-[var(--terminal-muted)]">제목</span>
                <span>{form.title ? "입력됨" : "비어 있음"}</span>
              </div>
              <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                <span className="text-[var(--terminal-muted)]">캐릭터</span>
                <span>{form.character ? "입력됨" : "비어 있음"}</span>
              </div>
              <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                <span className="text-[var(--terminal-muted)]">태그 수</span>
                <span>
                  {form.tags
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean).length}
                </span>
              </div>
            </div>
          </aside>
        </form>
      </main>
    </div>
  );
}
