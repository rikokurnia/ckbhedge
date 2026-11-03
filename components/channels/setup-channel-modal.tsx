"use client";

import { useState, useEffect } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  X,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { TokenLogo } from "@/components/shared/ui";
import { ChannelData } from "./types";
import { formatAmount } from "@/lib/demo";

interface SetupChannelModalProps {
  open: boolean;
  onClose: () => void;
  channel: ChannelData;
  onSuccess: (amount: number) => void;
}

export function SetupChannelModal({
  open,
  onClose,
  channel,
  onSuccess,
}: SetupChannelModalProps) {
  const [amountStr, setAmountStr] = useState<string>("50000");
  const [step, setStep] = useState<"input" | "pending" | "success">("input");
  const [pendingPhase, setPendingPhase] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const amount = parseFloat(amountStr) || 0;
  const walletBalance = channel.walletBalance;

  useEffect(() => {
    if (open) {
      setStep("input");
      const defaultAmount =
        channel.walletBalance >= 50000 ? 50000 : channel.walletBalance;
      setAmountStr(String(defaultAmount));
      setPendingPhase(1);
      setErrorMessage("");
    }
  }, [open]);

  const handleAmountChange = (val: string) => {
    if (/^\d*\.?\d*$/.test(val)) {
      setAmountStr(val);
      const n = parseFloat(val) || 0;
      if (n > walletBalance) {
        setErrorMessage(
          `Amount exceeds available L1 balance (${formatAmount(walletBalance)} CKB)`,
        );
      } else {
        setErrorMessage("");
      }
    }
  };

  const handleStartSetup = () => {
    if (amount <= 0) {
      setErrorMessage("Please enter an amount to open the channel.");
      return;
    }
    if (amount > walletBalance) {
      setErrorMessage(`Insufficient L1 wallet balance.`);
      return;
    }

    setStep("pending");
    setPendingPhase(1);

    setTimeout(() => {
      setPendingPhase(2);
      setTimeout(() => {
        setPendingPhase(3);
        setTimeout(() => {
          setStep("success");
          onSuccess(amount);
        }, 1200);
      }, 1400);
    }, 1200);
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
                {step === "input" && "Set up Fiber channel"}
                {step === "pending" && "Opening channel…"}
                {step === "success" && "Channel is now open!"}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="text-[13px] text-[#8ea096] mt-0.5">
                Establish a 2-of-2 off-chain payment channel with LP node
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close
              className="text-[#8ea096] hover:text-white p-1 rounded-lg transition-colors bg-transparent border-0 cursor-pointer"
              aria-label="Close"
            >
              <X size={20} />
            </DialogPrimitive.Close>
          </div>

          {/* STEP 1: INPUT */}
          {step === "input" && (
            <div className="flex flex-col gap-4">
              <div className="p-3.5 rounded-xl bg-[#14221c] border border-[#23352d] text-[13px] text-[#c6d6ce] flex items-start gap-2.5">
                <Zap size={18} className="text-[#16efaa] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Opening a Fiber channel creates a Funding Cell on CKB Layer 1.
                  Once established, you can swap between CKB and USDC instantly
                  with 0 L1 gas.
                </p>
              </div>

              {/* Amount input */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[13px]">
                  <label
                    htmlFor="setup-amount-input"
                    className="font-medium text-[#c6d6ce]"
                  >
                    Initial funding amount (CKB)
                  </label>
                  <span className="text-[#8ea096]">
                    Wallet:{" "}
                    <strong className="text-white">
                      {formatAmount(walletBalance)} CKB
                    </strong>
                  </span>
                </div>

                <div className="relative flex items-center rounded-xl bg-[#0c1612] border border-[#23352d] focus-within:border-[#16efaa] transition-colors p-2">
                  <div className="pl-2 pr-1">
                    <TokenLogo token="CKB" />
                  </div>
                  <input
                    id="setup-amount-input"
                    type="text"
                    inputMode="decimal"
                    value={amountStr}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="50000"
                    className="w-full bg-transparent border-0 text-[20px] font-bold text-white px-2 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setAmountStr(String(walletBalance));
                      setErrorMessage("");
                    }}
                    className="shrink-0 px-2.5 py-1 rounded-md text-[12px] font-semibold text-[#16efaa] bg-[#16efaa]/10 hover:bg-[#16efaa]/20 border border-[#16efaa]/30 cursor-pointer transition-colors"
                  >
                    MAX
                  </button>
                </div>

                {errorMessage && (
                  <p className="text-[12px] text-[#ff505a] mt-1">
                    {errorMessage}
                  </p>
                )}
              </div>

              {/* Parameters info */}
              <div className="p-3.5 rounded-xl bg-[#0c1612] border border-[#23352d] flex flex-col gap-2 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-[#8ea096]">Peer LP Node:</span>
                  <span className="font-mono text-[11px] text-white">
                    Fiber node (0x02bf…91a0)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8ea096]">
                    Provided Inbound Quota:
                  </span>
                  <span className="text-[#16efaa] font-semibold">
                    2,500 USDC
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8ea096]">Settlement Script:</span>
                  <span className="text-white flex items-center gap-1 text-[12px]">
                    <ShieldCheck size={13} className="text-[#16efaa]" />
                    Official Fiber 2-of-2 Multi-Sig
                  </span>
                </div>
              </div>

              <button
                type="button"
                data-action="confirm-setup"
                disabled={amount <= 0 || amount > walletBalance}
                onClick={handleStartSetup}
                className="w-full h-[48px] rounded-[14px] font-semibold text-[15px] transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer shadow-md disabled:opacity-45 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: "#16efaa",
                  color: "#00180f",
                }}
              >
                <span>Open channel & deposit</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* STEP 2: PENDING SIMULATION */}
          {step === "pending" && (
            <div className="flex flex-col items-center text-center py-6 gap-4">
              <div className="w-14 h-14 rounded-full bg-[#16efaa]/10 border border-[#16efaa]/30 flex items-center justify-center text-[#16efaa] animate-spin">
                <Loader2 size={28} />
              </div>

              <div className="flex flex-col gap-1">
                <h4 className="text-[17px] font-semibold text-white">
                  Establishing Channel on Fiber
                </h4>
                <p className="text-[13px] text-[#8ea096]">
                  Creating 2-of-2 multisig funding transaction and syncing with
                  LP Node.
                </p>
              </div>

              <div className="w-full flex flex-col gap-2.5 mt-2 text-[13px] text-left">
                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#0c1612] border border-[#23352d]">
                  {pendingPhase >= 1 ? (
                    <CheckCircle2
                      size={16}
                      className="text-[#16efaa] shrink-0"
                    />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-[#8ea096] shrink-0" />
                  )}
                  <span
                    className={
                      pendingPhase >= 1 ? "text-white" : "text-[#8ea096]"
                    }
                  >
                    Generating 2-of-2 multisig funding cell
                  </span>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#0c1612] border border-[#23352d]">
                  {pendingPhase >= 2 ? (
                    pendingPhase === 2 ? (
                      <Loader2
                        size={16}
                        className="text-[#16efaa] animate-spin shrink-0"
                      />
                    ) : (
                      <CheckCircle2
                        size={16}
                        className="text-[#16efaa] shrink-0"
                      />
                    )
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-[#8ea096] shrink-0" />
                  )}
                  <span
                    className={
                      pendingPhase >= 2 ? "text-white" : "text-[#8ea096]"
                    }
                  >
                    Broadcasting funding transaction to CKB L1
                  </span>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#0c1612] border border-[#23352d]">
                  {pendingPhase >= 3 ? (
                    <CheckCircle2
                      size={16}
                      className="text-[#16efaa] shrink-0"
                    />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-[#8ea096] shrink-0" />
                  )}
                  <span
                    className={
                      pendingPhase >= 3 ? "text-white" : "text-[#8ea096]"
                    }
                  >
                    LP Node confirmed inbound quota (2,500 USDC)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS */}
          {step === "success" && (
            <div className="flex flex-col items-center text-center py-4 gap-4">
              <div className="w-14 h-14 rounded-full bg-[#16efaa]/15 border border-[#16efaa]/30 flex items-center justify-center text-[#16efaa]">
                <CheckCircle2 size={32} />
              </div>

              <div className="flex flex-col gap-1">
                <h4 className="text-[18px] font-semibold text-white">
                  Fiber channel is active!
                </h4>
                <p className="text-[13px] text-[#8ea096]">
                  {formatAmount(amount)} CKB committed. You can now execute
                  sub-second swaps and automatic hedging.
                </p>
              </div>

              <button
                type="button"
                data-action="close-setup-success"
                onClick={onClose}
                className="w-full h-[48px] rounded-[14px] font-semibold text-[15px] transition-all flex items-center justify-center cursor-pointer shadow-md mt-2"
                style={{
                  backgroundColor: "#16efaa",
                  color: "#00180f",
                }}
              >
                Go to channel
              </button>
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
