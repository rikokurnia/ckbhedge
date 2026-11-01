"use client";

import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  X,
  ExternalLink,
  Coins,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { formatAmount } from "@/lib/demo";

interface FaucetModalProps {
  open: boolean;
  onClose: () => void;
  walletBalance: number;
  onClaimDemoCkb: (amount: number) => void;
}

export function FaucetModal({
  open,
  onClose,
  walletBalance,
  onClaimDemoCkb,
}: FaucetModalProps) {
  const [claimed, setClaimed] = useState(false);

  const handleClaim = () => {
    onClaimDemoCkb(10000);
    setClaimed(true);
    setTimeout(() => {
      setClaimed(false);
    }, 3500);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="dialog-overlay backdrop-blur-md" />
        <DialogPrimitive.Content
          className="dialog-content text-left"
          style={{
            maxWidth: "480px",
            backgroundColor: "#101d17",
            borderColor: "#263b31",
            borderRadius: "24px",
            padding: "28px",
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <DialogPrimitive.Title className="text-[20px] font-bold text-white">
                Get Testnet CKB
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="text-[13px] text-[#8ea096] mt-0.5">
                Official faucets & demo testnet top-up for CKB Pudge
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close
              className="text-[#8ea096] hover:text-white p-1 rounded-lg transition-colors bg-transparent border-0 cursor-pointer"
              aria-label="Close"
            >
              <X size={20} />
            </DialogPrimitive.Close>
          </div>

          <div className="flex flex-col gap-4">
            {/* Quick Demo Wallet Faucet (Instant gratification for testing) */}
            <div className="p-4 rounded-xl bg-[#0c1612] border border-[#23352d] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-white flex items-center gap-2">
                  <Coins size={16} className="text-[#16efaa]" />
                  Instant Demo Faucet
                </span>
                <span className="text-[12px] text-[#8ea096]">
                  Wallet:{" "}
                  <strong className="text-white">
                    {formatAmount(walletBalance)} CKB
                  </strong>
                </span>
              </div>

              <p className="text-[12px] text-[#8ea096] leading-relaxed">
                Add simulated testnet CKB to your L1 wallet to test channel
                funding and withdrawals.
              </p>

              {claimed ? (
                <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#16efaa]/15 text-[#16efaa] text-[13px] font-medium">
                  <CheckCircle2 size={16} />
                  <span>+10,000 CKB added to demo wallet!</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleClaim}
                  className="w-full h-[42px] rounded-xl font-semibold text-[14px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  style={{
                    backgroundColor: "#16efaa",
                    color: "#00180f",
                  }}
                >
                  <Coins size={16} />
                  <span>Claim +10,000 demo CKB</span>
                </button>
              )}
            </div>

            {/* Official Verified Faucets */}
            <div className="flex flex-col gap-2">
              <span className="text-[13px] font-medium text-[#c6d6ce]">
                Official verified Nervos resources
              </span>

              <a
                href="https://faucet.nervos.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-[#14231d] hover:bg-[#1a2d25] border border-[#23352d] transition-colors flex items-center justify-between text-[13px] text-white group"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-white group-hover:text-[#16efaa] transition-colors">
                    Nervos Official Testnet Faucet
                  </span>
                  <span className="text-[11px] text-[#8ea096]">
                    faucet.nervos.org (Pudge Network)
                  </span>
                </div>
                <ExternalLink
                  size={16}
                  className="text-[#8ea096] group-hover:text-[#16efaa] transition-colors"
                />
              </a>

              <a
                href="https://testnet.joyid.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-[#14231d] hover:bg-[#1a2d25] border border-[#23352d] transition-colors flex items-center justify-between text-[13px] text-white group"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-white group-hover:text-[#16efaa] transition-colors">
                    JoyID Testnet Passkey Wallet
                  </span>
                  <span className="text-[11px] text-[#8ea096]">
                    testnet.joyid.dev
                  </span>
                </div>
                <ExternalLink
                  size={16}
                  className="text-[#8ea096] group-hover:text-[#16efaa] transition-colors"
                />
              </a>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-[#71857b] pt-1 border-t border-[#1f3128]">
              <ShieldCheck size={13} className="text-[#16efaa]" />
              <span>
                Testnet prototype · Test tokens have no monetary value
              </span>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
