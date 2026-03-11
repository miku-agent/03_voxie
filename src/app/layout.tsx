import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-terminal",
  subsets: ["latin"],
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
    <html lang="en">
      <body className={`${jetbrainsMono.variable} antialiased`}>
        <div className="relative z-2 border-b border-[var(--terminal-border)] bg-[rgba(5,8,22,0.82)] backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--terminal-accent)]">
                Voxie // Miku Console
              </p>
              <p className="mt-1 text-xs text-[var(--terminal-muted)]">
                vocaloid archive interface [online]
              </p>
            </div>
            <nav className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] text-[var(--terminal-muted)]">
              <a className="terminal-chip" href="/">
                cards
              </a>
              <a className="terminal-chip" href="/decks">
                decks
              </a>
              <a className="terminal-chip" href="/cards/new">
                create-card
              </a>
              <a className="terminal-chip" href="/decks/new">
                create-deck
              </a>
            </nav>
          </div>
        </div>

        {children}

        <footer className="mx-auto max-w-6xl px-4 pb-8 pt-2 text-xs uppercase tracking-[0.14em] text-[var(--terminal-muted)] sm:px-6">
          <div className="border-t border-[var(--terminal-border)] pt-4">
            voxie://archive ready · theme=miku-phosphor · status [stable]
          </div>
        </footer>
      </body>
    </html>
  );
}
