import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Cake } from "lucide-react";
import { fr } from "@/messages/fr";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = { title: fr.appName };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} dark`}>
      <body>
        <header className="border-b">
          <div className="page-width flex h-14 items-center gap-6 px-4 sm:px-6 lg:px-10">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <Cake className="size-4 text-primary" /> {fr.appName}
            </span>
            <nav className="flex gap-4 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">{fr.nav.birthdays}</Link>
              <Link href="/destinataires" className="hover:text-foreground">{fr.nav.recipients}</Link>
            </nav>
          </div>
        </header>
        <main className="page-width space-y-6 px-4 py-8 sm:px-6 lg:px-10">{children}</main>
      </body>
    </html>
  );
}
