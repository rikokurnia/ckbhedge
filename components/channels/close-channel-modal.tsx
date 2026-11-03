"use client";

import { useState, useEffect } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";
import { ChannelData } from "./types";
import { formatAmount } from "@/lib/demo";

interface CloseChannelModalProps {
  open: boolean;
  onClose: () => void;
  channel: ChannelData;
  onSuccess: () => void;
}

type ModalStep = "review" | "pending" | "success" | "failed";

export function CloseChannelModal({
  open,
  onClose,
  channel,
  onSuccess,
}: CloseChannelModalProps) {
  const [step, setStep] = useState<ModalStep>("review");
  const [pendingPhase, setPendingPhase] = useState<number>(1);
  const [simulateFailure, setSimulateFailure] = useState<boolean>(false);
  const [confirmedRisk, setConfirmedRisk] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      setStep("review");
      setPendingPhase(1);
      setConfirmedRisk(false);
    }
  }, [open]);

  const handleConfirmClose = () => {
    setStep("pending");
    setPendingPhase(1);

    // Phase 1: Cooperative signature exchange with LP node
    setTimeout(() => {
      setPendingPhase(2);

      // Phase 2: Generating and broadcasting L1 settlement
      setTimeout(() => {
        if (simulateFailure) {
          setStep("failed");
        } else {
          setPendingPhase(3);
          // Phase 3: L1 settlement finalized
          setTimeout(() => {
            setStep("success");
            onSuccess();
          }, 1200);
        }
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
                {step === "review" && "Close & withdraw channel"}
                {step === "pending" && "Closing channel…"}
                {step === "success" && "Channel closed & settled"}
                {step === "failed" && "Settlement failed"}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="text-[13px] text-[#8ea096] mt-0.5">
                Cooperative close settles funds directly to CKB Layer 1
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close
              className="text-[#8ea096] hover:text-white p-1 rounded-lg transition-colors bg-transparent border-0 cursor-pointer"
              aria-label="Close"
            >
              <X size={20} />
            </DialogPrimitive.Close>
          </div>

          {/* STEP 1: REVIEW */}
          {step === "review" && (
            <div className="flex flex-col gap-4">
              {/* Explanation Note */}
              <div className="p-3.5 rounded-xl bg-[#14221c] border border-[#23352d] text-[13px] text-[#c6d6ce] flex items-start gap-2.5">
                <AlertCircle
                  size={18}
                  className="text-[#ffc12c] shrink-0 mt-0.5"
                />
                <p className="leading-relaxed">
                  Closing this channel returns all committed funds back to your
                  Layer 1 wallet. Instant zero-gas swaps will be disabled until
                  you set up a new channel.
                </p>
              </div>

              {/* Settlement Summary Box */}
              <div className="p-4 rounded-xl bg-[#0c1612] border border-[#23352d] flex flex-col gap-2.5 text-[13px]">
                <div className="flex justify-between items-center pb-2 border-b border-[#1f3128]">
                  <span className="text-[#8ea096]">Funds returning to L1</span>
                  <div className="flex flex-col items-end">
                    <span className="text-[17px] font-bold text-[#16efaa]">
                      +{formatAmount(channel.localCapacity)} CKB
                    </span>
                    {channel.usdcBalance > 0 && (
                      <span className="text-[13px] font-semibold text-white">
                        +{formatAmount(channel.usdcBalance)} USDC
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#8ea096]">Destination wallet</span>
                  <span className="font-mono text-[12px] text-white">
                    ckt1…8f2a (JoyID)
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#8ea096]">Settlement method</span>
                  <span className="text-white font-medium">
                    Cooperative close (Mutual)
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#8ea096]">
                    Dispute challenge delay
                  </span>
                  <span className="text-[#16efaa] font-medium">
                    None (Instant mutual settlement)
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#8ea096]">Estimated miner fee</span>
                  <span className="text-white">~0.001 CKB</span>
                </div>
              </div>

              {/* Checkbox confirmation */}
              <label
                htmlFor="close-channel-confirm-checkbox"
                className="flex items-start gap-2.5 cursor-pointer text-[13px] text-[#8ea096] select-none"
              >
                <input
                  id="close-channel-confirm-checkbox"
                  type="checkbox"
                  checked={confirmedRisk}
                  onChange={(e) => setConfirmedRisk(e.target.checked)}
                  className="mt-0.5 rounded border-[#23352d] accent-[#16efaa] cursor-pointer"
                />
                <span>
                  I understand that this will close my Fiber channel and settle
                  funds back to CKB L1.
                </span>
              </label>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-[48px] rounded-[14px] font-medium text-[14px] text-[#c6d6ce] bg-[#14231d] hover:bg-[#1a2d25] border border-[#23352d] cursor-pointer transition-colors"
                >
                  Keep channel open
                </button>

                <button
                  type="button"
                  data-action="confirm-close"
                  onClick={handleConfirmClose}
                  className="flex-1 h-[48px] rounded-[14px] font-semibold text-[14px] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:brightness-110 active:scale-[0.99]"
                  style={{
                    backgroundColor: "#ff505a",
                    color: "#ffffff",
                  }}
                >
                  <span>Close & withdraw</span>
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PENDING SIMULATION */}
          {step === "pending" && (
            <div className="flex flex-col items-center text-center py-6 gap-4">
              <div className="w-14 h-14 rounded-full bg-[#ffc12c]/10 border border-[#ffc12c]/30 flex items-center justify-center text-[#ffc12c] animate-spin">
                <Loader2 size={28} />
              </div>

              <div className="flex flex-col gap-1">
                <h4 className="text-[17px] font-semibold text-white">
                  Executing Cooperative Settlement
                </h4>
                <p className="text-[13px] text-[#8ea096]">
                  Exchanging signatures with LP node and submitting L1
                  settlement cell.
                </p>
              </div>

              {/* Progress Steps */}
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
                    Exchanging mutual close signatures with LP Node
                  </span>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#0c1612] border border-[#23352d]">
                  {pendingPhase >= 2 ? (
                    pendingPhase === 2 ? (
                      <Loader2
                        size={16}
                        className="text-[#ffc12c] animate-spin shrink-0"
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
                    Broadcasting cooperative settlement cell to CKB L1
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
                    Unlocking funds to your L1 address
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
                  Channel closed & settled!
                </h4>
                <p className="text-[13px] text-[#8ea096]">
                  {formatAmount(channel.localCapacity)} CKB has been returned
                  directly to your Layer 1 wallet.
                </p>
              </div>

              <div className="w-full p-3 rounded-xl bg-[#0c1612] border border-[#23352d] flex flex-col gap-2 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-[#8ea096]">New L1 Wallet Balance:</span>
                  <strong className="text-[#16efaa] font-semibold">
                    {formatAmount(
                      channel.walletBalance + channel.localCapacity,
                    )}{" "}
                    CKB
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8ea096]">Fiber Channel Status:</span>
                  <span className="text-[#8ea096]">Closed (0 CKB)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8ea096]">Settlement Tx:</span>
                  <span className="font-mono text-[11px] text-[#8ea096]">
                    0x3f1c…99d4
                  </span>
                </div>
              </div>

              <button
                type="button"
                data-action="close-success-done"
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

          {/* STEP 4: FAILED */}
          {step === "failed" && (
            <div className="flex flex-col items-center text-center py-4 gap-4">
              <div className="w-14 h-14 rounded-full bg-[#ff505a]/15 border border-[#ff505a]/30 flex items-center justify-center text-[#ff505a]">
                <AlertTriangle size={32} />
              </div>

              <div className="flex flex-col gap-1">
                <h4 className="text-[18px] font-semibold text-white">
                  Cooperative close timed out
                </h4>
                <p className="text-[13px] text-[#8ea096]">
                  The channel could not be closed. Your channel and funds remain
                  secure in Fiber.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-[48px] rounded-[14px] font-medium text-[14px] text-[#c6d6ce] bg-[#14231d] hover:bg-[#1a2d25] border border-[#23352d] cursor-pointer transition-colors"
                >
                  Close dialog
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSimulateFailure(false);
                    setStep("review");
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
