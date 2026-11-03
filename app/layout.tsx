import type { Metadata } from "next";
import "./globals.css";
import { Background } from "@/components/shared/background";
import { Navbar } from "@/components/shared/navbar";
export const metadata: Metadata = {
  title: "CKBHedge — Trade & Protect",
  description:
    "CKB swaps, portfolio management, and protection tools for the Fiber Network.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Background />
        <div className="app-shell">
          <Navbar />
          <main>{children}</main>
          <footer>
            Preview only · Wallet transactions and funds movement are not
            connected.
          </footer>
        </div>
      </body>
    </html>
  );
}
