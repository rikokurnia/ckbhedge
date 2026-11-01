import type { Metadata } from "next";
import "./globals.css";
import { Background } from "@/components/shared/background";
import { Navbar } from "@/components/shared/navbar";
export const metadata: Metadata = {
  title: "CKBHedge — Trade & Protect",
  description: "A frontend demo of instant swaps and CKB protection on Fiber.",
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
            Testnet prototype · Demo data · USDC is a demo asset · No real funds
            movement
          </footer>
        </div>
      </body>
    </html>
  );
}
