"use client";

import { useState, useEffect } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  X,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Wallet,
  Zap,
} from "lucide-react";
import { TokenLogo } from "@/components/shared/ui";
import { ChannelData } from "./types";
import { formatAmount } from "@/lib/demo";

interface AddFundsModalProps {
  open: boolean;
  onClose: () => void;
  channel: ChannelData;
  onSuccess: (amount: number) => void;
}

type ModalStep = "input" | "review" | "pending" | "success" | "failed";

export function AddFundsModal({
  open,
  onClose,
  channel,
  onSuccess,
}: AddFundsModalProps) {
  const [step, setStep] = useState<ModalStep>("input");
  const [amountStr, setAmountStr] = useState<string>("5000");
  const [pendingPhase, setPendingPhase] = useState<number>(1);
  const [simulateFailure, setSimulateFailure] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const amount = parseFloat(amountStr) || 0;
  const walletBalance = channel.walletBalance;

  // Reset modal state on open
  useEffect(() => {
    if (open) {
      setStep("input");
      setAmountStr(
        channel.walletBalance >= 5000 ? "5000" : String(channel.walletBalance),
      );
      setErrorMessage("");
      setPendingPhase(1);
    }
  }, [open]);

  // Handle amount validation
  const handleAmountChange = (val: string) => {
    // Only allow numbers and decimal
    if (/^\d*\.?\d*$/.test(val)) {
      setAmountStr(val);
      const n = parseFloat(val) || 0;
      if (n > walletBalance) {
        setErrorMessage(
          `Amount exceeds your L1 wallet balance (${formatAmount(walletBalance)} CKB)`,
        );
      } else {
        setErrorMessage("");
      }
    }
  };

  const handleMax = () => {
    setAmountStr(String(walletBalance));
    setErrorMessage("");
  };

  const handleAddQuick = (increment: number) => {
    const cur = parseFloat(amountStr) || 0;
    const next = Math.min(walletBalance, cur + increment);
    setAmountStr(String(next));
    setErrorMessage("");
  };

  // Execute Simulated Funding
  const handleProceedToReview = () => {
    if (amount <= 0) {
      setErrorMessage("Please enter an amount to deposit.");
      return;
    }
    if (amount > walletBalance) {
      setErrorMessage(
        `Insufficient L1 wallet funds. Available: ${formatAmount(walletBalance)} CKB.`,
      );
      return;
    }
    setStep("review");
  };

  const handleConfirmFunding = () => {
    setStep("pending");
    setPendingPhase(1);

    // Phase 1: Signing with JoyID
    setTimeout(() => {
      setPendingPhase(2);

      // Phase 2: Broadcasting L1 Funding Cell
      setTimeout(() => {
        if (simulateFailure) {
          setStep("failed");
        } else {
          setPendingPhase(3);
          // Phase 3: Finalizing Fiber state
          setTimeout(() => {
            setStep("success");
            onSuccess(amount);
          }, 1200);
        }
      }, 1400);
    }, 1200);
  };

  const isInputValid = amount > 0 && amount <= walletBalance;

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
                {step === "success" && "Deposit confirmed"}
                {step === "failed" && "Deposit failed"}
                {step === "pending" && "Funding channel…"}
                {step === "review" && "Review deposit"}
                {step === "input" && "Add funds to Fiber"}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="text-[13px] text-[#8ea096] mt-0.5">
                Channel funding
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
              {/* Wallet vs Fiber Balance Banner */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#0c1612] border border-[#23352d]">
                <div className="flex flex-col">
                  <span className="text-[11px] text-[#8ea096] flex items-center gap-1">
                    <Wallet size={12} className="text-[#16efaa]" />
                    L1 Wallet Balance
                  </span>
                  <span className="text-[15px] font-semibold text-white mt-0.5">
                    {formatAmount(channel.walletBalance)} CKB
                  </span>
                  <span className="text-[10px] text-[#71857b]">
                    Settled on L1
                  </span>
                </div>

                <div className="flex flex-col border-l border-[#23352d] pl-3">
                  <span className="text-[11px] text-[#8ea096] flex items-center gap-1">
                    <Zap size={12} className="text-[#16efaa]" />
                    Current Fiber Balance
                  </span>
                  <span className="text-[15px] font-semibold text-white mt-0.5">
                    {formatAmount(channel.localCapacity)} CKB
                  </span>
                  <span className="text-[10px] text-[#71857b]">
                    Available for swaps
                  </span>
                </div>
              </div>

              {/* Amount input box */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="funding-amount-input"
                  className="text-[13px] font-medium text-[#c6d6ce]"
                >
                  Amount to add (CKB)
                </label>

                <div className="relative flex items-center rounded-xl bg-[#0c1612] border border-[#23352d] focus-within:border-[#16efaa] transition-colors p-2">
                  <div className="pl-2 pr-1">
                    <TokenLogo token="CKB" />
                  </div>
                  <input
                    id="funding-amount-input"
                    type="text"
                    inputMode="decimal"
                    value={amountStr}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="0"
                    className="w-full bg-transparent border-0 text-[20px] font-bold text-white px-2 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleMax}
                    className="shrink-0 px-2.5 py-1 rounded-md text-[12px] font-semibold text-[#16efaa] bg-[#16efaa]/10 hover:bg-[#16efaa]/20 border border-[#16efaa]/30 cursor-pointer transition-colors"
                  >
                    MAX
                  </button>
                </div>

                {errorMessage ? (
                  <p className="text-[12px] text-[#ff505a] mt-1">
                    {errorMessage}
                  </p>
                ) : (
                  <p className="text-[12px] text-[#8ea096] mt-0.5">
                    Cell storage requirement: min ~61 CKB
                  </p>
                )}
              </div>

              {/* Quick increment buttons */}
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-[#8ea096]">Quick:</span>
                {[1000, 5000, 10000].map((inc) => (
                  <button
                    key={inc}
                    type="button"
                    onClick={() => handleAddQuick(inc)}
                    className="px-2.5 py-1 rounded-lg text-[12px] text-[#c6d6ce] bg-[#14231d] hover:bg-[#1a2d25] border border-[#23352d] cursor-pointer transition-colors"
                  >
                    +{formatAmount(inc)}
                  </button>
                ))}
              </div>

              {/* Proceed to Review Button */}
              <button
                type="button"
                disabled={!isInputValid}
                onClick={handleProceedToReview}
                className="w-full h-[48px] rounded-[14px] font-semibold text-[15px] transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer shadow-md disabled:opacity-45 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: "#16efaa",
                  color: "#00180f",
                }}
              >
                <span>Continue to review</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* STEP 2: REVIEW */}
          {step === "review" && (
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-xl bg-[#0c1612] border border-[#23352d] flex flex-col gap-3 text-[13px]">
                <div className="flex justify-between items-center pb-2 border-b border-[#1f3128]">
                  <span className="text-[#8ea096]">Amount to deposit</span>
                  <span className="text-[18px] font-bold text-white">
                    {formatAmount(amount)} CKB
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#8ea096]">Source</span>
                  <span className="font-mono text-[12px] text-white">
                    L1 Wallet (ckt1…8f2a)
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#8ea096]">Destination</span>
                  <span className="font-mono text-[12px] text-[#16efaa]">
                    Fiber Channel ({channel.id})
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#8ea096]">L1 Miner Fee</span>
                  <span className="text-white">~0.001 CKB</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#8ea096]">
                    Fiber Instant Swaps Fee
                  </span>
                  <span className="text-[#16efaa] font-medium">
                    0 CKB (Free off-chain)
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-[#1f3128]">
                  <span className="text-[#8ea096]">Est. confirmation</span>
                  <span className="text-white">
                    ~10-20 seconds (1 L1 block)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setStep("input")}
                  className="flex-1 h-[48px] rounded-[14px] font-medium text-[14px] text-[#c6d6ce] bg-[#14231d] hover:bg-[#1a2d25] border border-[#23352d] cursor-pointer transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  data-action="confirm-deposit"
                  onClick={handleConfirmFunding}
                  className="flex-2 h-[48px] rounded-[14px] font-semibold text-[15px] transition-all flex items-center justify-center cursor-pointer shadow-md"
                  style={{
                    backgroundColor: "#16efaa",
                    color: "#00180f",
                  }}
                >
                  Confirm deposit
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PENDING SIMULATION */}
          {step === "pending" && (
            <div className="flex flex-col items-center text-center py-6 gap-4">
              <div className="w-14 h-14 rounded-full bg-[#16efaa]/10 border border-[#16efaa]/30 flex items-center justify-center text-[#16efaa] animate-spin">
                <Loader2 size={28} />
              </div>

              <div className="flex flex-col gap-1">
                <h4 className="text-[17px] font-semibold text-white">
                  Executing L1 Deposit
                </h4>
                <p className="text-[13px] text-[#8ea096]">
                  Please wait while the funding transaction commits to CKB L1.
                </p>
              </div>

              {/* Progress steps */}
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
                    Signing with JoyID biometric passkey
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
                    Broadcasting Funding Cell to CKB L1
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
                    Updating Fiber channel commitment state
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === "success" && (
            <div className="flex flex-col items-center text-center py-4 gap-4">
              <div className="w-14 h-14 rounded-full bg-[#16efaa]/15 border border-[#16efaa]/30 flex items-center justify-center text-[#16efaa]">
                <CheckCircle2 size={32} />
              </div>

              <div className="flex flex-col gap-1">
                <h4 className="text-[18px] font-semibold text-white">
                  Funds added successfully!
                </h4>
                <p className="text-[13px] text-[#8ea096]">
                  +{formatAmount(amount)} CKB is now available in your Fiber
                  channel for instant swaps.
                </p>
              </div>

              <div className="w-full p-3 rounded-xl bg-[#0c1612] border border-[#23352d] flex flex-col gap-2 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-[#8ea096]">New Fiber Balance:</span>
                  <strong className="text-[#16efaa] font-semibold">
                    {formatAmount(channel.localCapacity + amount)} CKB
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8ea096]">Remaining L1 Wallet:</span>
                  <span className="text-white">
                    {formatAmount(channel.walletBalance - amount)} CKB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8ea096]">L1 Tx Hash:</span>
                  <span className="font-mono text-[11px] text-[#8ea096]">
                    0x7a91…b42e
                  </span>
                </div>
              </div>

              <button
                type="button"
                data-action="add-funds-done"
                onClick={onClose}
                className="w-full h-[48px] rounded-[14px] font-semibold text-[15px] transition-all flex items-center justify-center cursor-pointer shadow-md mt-2"
                style={{
                  backgroundColor: "#16efaa",
                  color: "#00180f",
                }}
              >
                Done
              </button>
            </div>
          )}

          {/* STEP 5: FAILED */}
          {step === "failed" && (
            <div className="flex flex-col items-center text-center py-4 gap-4">
              <div className="w-14 h-14 rounded-full bg-[#ff505a]/15 border border-[#ff505a]/30 flex items-center justify-center text-[#ff505a]">
                <AlertTriangle size={32} />
              </div>

              <div className="flex flex-col gap-1">
                <h4 className="text-[18px] font-semibold text-white">
                  Funding transaction failed
                </h4>
                <p className="text-[13px] text-[#8ea096]">
                  Funding could not be completed. No funds were deducted from
                  your wallet.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-[48px] rounded-[14px] font-medium text-[14px] text-[#c6d6ce] bg-[#14231d] hover:bg-[#1a2d25] border border-[#23352d] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSimulateFailure(false);
                    setStep("input");
                  }}
                  className="flex-1 h-[48px] rounded-[14px] font-semibold text-[15px] transition-all flex items-center justify-center cursor-pointer shadow-md"
                  style={{
                    backgroundColor: "#16efaa",
                    color: "#00180f",
                  }}
                >
                  Try again
                </button>
              </div>
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
