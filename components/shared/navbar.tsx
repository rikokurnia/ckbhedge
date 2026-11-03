"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button, Dialog } from "./ui";
export function Navbar() {
  const pathname = usePathname();
  const [dialog, setDialog] = useState("");
  return (
    <>
      <header className="navbar">
        <Link className="brand" href="/trade">
          CKB<span>Hedge</span>
        </Link>
        <nav aria-label="Main navigation">
          {["Trade", "Portfolio", "Channels"].map((name) => (
            <Link
              key={name}
              href={`/${name.toLowerCase()}`}
              aria-current={
                pathname === `/${name.toLowerCase()}` ? "page" : undefined
              }
            >
              {name}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <Button
            variant="ghost"
            aria-label="Settings"
            onClick={() => setDialog("Settings")}
          >
            <Settings size={22} />
          </Button>
          <Button variant="secondary" onClick={() => setDialog("Wallet")}>
            Wallet <ChevronDown size={16} />
          </Button>
        </div>
      </header>
      <Dialog open={!!dialog} title={dialog} onClose={() => setDialog("")}>
        <p>
          {dialog === "Wallet"
            ? "Wallet connection is not available yet."
            : "Display currency: USD · Default slippage: 0.5% · Network: Fiber"}
        </p>
        <Button onClick={() => setDialog("")}>Got it</Button>
      </Dialog>
    </>
  );
}
