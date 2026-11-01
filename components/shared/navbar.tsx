"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Badge, Button, Dialog } from "./ui";
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
          <Badge>
            <i />
            Testnet
          </Badge>
          <Button
            variant="ghost"
            aria-label="Settings"
            onClick={() => setDialog("Demo settings")}
          >
            <Settings size={22} />
          </Button>
          <Button variant="secondary" onClick={() => setDialog("Demo wallet")}>
            JoyID · ckt1…8f2a <ChevronDown size={16} />
          </Button>
        </div>
      </header>
      <Dialog open={!!dialog} title={dialog} onClose={() => setDialog("")}>
        <p>
          {dialog.includes("wallet")
            ? "You are exploring a simulated JoyID wallet. No wallet is connected."
            : "CKB Testnet preview. All balances, quotes, channels, and authorizations are simulated. USDC integration is unverified."}
        </p>
        <Button onClick={() => setDialog("")}>Got it</Button>
      </Dialog>
    </>
  );
}
