import type { Metadata } from "next";
import Link from "next/link";
import localFont from "next/font/local";
import "./globals.css";

const galmuri = localFont({
  src: [
    {
      path: "../../public/fonts/Galmuri11.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Galmuri11-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-terminal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Voxie",
  description: "Vocaloid community card archive",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${galmuri.variable} antialiased`}>
        <div className="site-shell">
          <header className="border-b border-[var(--terminal-border)] bg-[rgba(5,8,22,0.88)] backdrop-blur-sm">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
              <div>
                <Link href="/" className="text-lg font-semibold text-[var(--terminal-fg)] hover:text-[var(--terminal-fg)]">
                  Voxie
                </Link>
                <p className="mt-1 text-sm text-[var(--terminal-muted)]">
                  보컬로이드 카드를 모으고 덱으로 정리하는 아카이브
                </p>
              </div>

              <nav className="flex flex-wrap items-center gap-2 text-sm text-[var(--terminal-soft)]">
                <Link className="nav-link" href="/">
                  카드
                </Link>
                <Link className="nav-link" href="/decks">
                  덱
                </Link>
                <Link className="nav-link" href="/cards/new">
                  카드 추가
                </Link>
                <Link className="nav-link" href="/decks/new">
                  덱 추가
                </Link>
              </nav>
            </div>
          </header>

          {children}

          <footer className="mx-auto max-w-6xl px-4 pb-8 pt-2 text-sm text-[var(--terminal-muted)] sm:px-6">
            <div className="border-t border-[var(--terminal-border)] pt-4">
              Voxie archive · cards / decks / notes
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
