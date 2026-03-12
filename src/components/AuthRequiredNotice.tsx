import Link from "next/link";

type Props = {
  message: string;
  ctaLabel?: string;
  className?: string;
};

export default function AuthRequiredNotice({ message, ctaLabel = "로그인하러 가기 →", className }: Props) {
  return (
    <div className={className ?? "border border-[var(--terminal-border)] px-3 py-3 text-xs leading-6 text-[var(--terminal-soft)]"}>
      {message} <Link href="/auth" className="underline underline-offset-4">{ctaLabel}</Link>
    </div>
  );
}
