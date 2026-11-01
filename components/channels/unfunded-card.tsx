"use client";

import { Zap, ArrowUpRight } from "lucide-react";
import { ChannelData } from "./types";
import { formatAmount } from "@/lib/demo";

interface UnfundedCardProps {
  channel: ChannelData;
  onOpenSetup: () => void;
  onOpenFaucet: () => void;
}

export function UnfundedCard({
  channel,
  onOpenSetup,
  onOpenFaucet,
}: UnfundedCardProps) {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Page Title & Subtitle */}
      <div className="w-full max-w-[500px] mb-5 text-left">
        <h1 className="text-[32px] font-bold text-white tracking-tight leading-tight">
          Channels
        </h1>
        <p className="text-[15px] text-[#8ea096] mt-1.5">
          Your funds for instant swaps.
        </p>
      </div>

      {/* Unfunded Channel Card */}
      <div
        className="w-full max-w-[500px] rounded-[24px] p-7 md:p-8 relative shadow-2xl backdrop-blur-md transition-all"
        style={{
          background: "rgba(15, 24, 21, 0.94)",
          border: "1px solid #23352d",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.45)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-6">
          <span className="text-[17px] font-semibold text-white tracking-wide">
            Your channel
          </span>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#788a81]" />
            <span className="text-[14px] font-medium text-[#8ea096]">
              Inactive
            </span>
          </div>
        </div>

        {/* Empty state illustration & message */}
        <div className="flex flex-col items-center text-center py-5 px-3">
          <div className="w-14 h-14 rounded-full bg-[#16efaa]/10 border border-[#16efaa]/20 flex items-center justify-center text-[#16efaa] mb-4">
            <Zap size={26} />
          </div>

          <h3 className="text-[18px] font-semibold text-white mb-2">
            No active Fiber channel
          </h3>
          <p className="text-[14px] text-[#8ea096] max-w-[360px] leading-relaxed">
            All your funds are currently settled on CKB Layer 1. Open a Fiber
            channel with your testnet CKB to enable sub-second swaps with 0 gas
            fee.
          </p>

          <div className="mt-4 px-3.5 py-2 rounded-xl bg-[#111c17] border border-[#23352d] text-[13px] text-[#a0b0a8]">
            Available in L1 wallet:{" "}
            <strong className="text-white font-semibold">
              {formatAmount(channel.walletBalance)} CKB
            </strong>
          </div>
        </div>

        {/* Action: Set up channel */}
        <div className="mt-6 flex flex-col items-center">
          <button
            type="button"
            onClick={onOpenSetup}
            className="w-full h-[52px] rounded-[14px] font-semibold text-[16px] transition-all duration-200 flex items-center justify-center cursor-pointer shadow-md active:scale-[0.99]"
            style={{
              backgroundColor: "#16efaa",
              color: "#00180f",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#50fbc2";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#16efaa";
            }}
          >
            Set up channel
          </button>

          <p className="mt-3 text-[13px] text-[#788a81] text-center font-normal">
            Funding and withdrawals settle on CKB L1.
          </p>
        </div>
      </div>

      {/* Small "Get test CKB" link below the card */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onOpenFaucet}
          className="inline-flex items-center gap-1 text-[14px] font-medium text-[#16efaa] hover:underline cursor-pointer bg-transparent border-0"
        >
          <span>Get testnet CKB</span>
          <ArrowUpRight size={15} />
        </button>
      </div>
    </div>
  );
}
