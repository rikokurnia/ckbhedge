"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ArrowUpRight } from "lucide-react";
import { TokenLogo } from "@/components/shared/ui";
import { formatAmount } from "@/lib/demo";
import { ChannelData } from "./types";
import { ChannelDetails } from "./channel-details";

interface ChannelCardProps {
  channel: ChannelData;
  onOpenAddFunds: () => void;
  onOpenCloseChannel: () => void;
  onOpenFaucet: () => void;
}

export function ChannelCard({
  channel,
  onOpenAddFunds,
  onOpenCloseChannel,
  onOpenFaucet,
}: ChannelCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Balance Rules:
  // Initial demo state has CKB funded and zero USDC, so hide the zero USDC row.
  // If shared demo state contains USDC received from a swap, show its balance too.
  const hasUsdc = channel.usdcBalance > 0;

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

      {/* Main Channel Funding Card */}
      <div
        className="w-full max-w-[500px] rounded-[24px] p-7 md:p-8 relative shadow-2xl backdrop-blur-md transition-all"
        style={{
          background: "rgba(15, 24, 21, 0.94)",
          border: "1px solid #23352d",
          boxShadow:
            "0 20px 60px rgba(0, 0, 0, 0.45), 0 0 40px rgba(22, 239, 170, 0.03)",
        }}
      >
        {/* Card Header: Channel title & status */}
        <div className="flex items-center justify-between pb-6">
          <span className="text-[17px] font-semibold text-white tracking-wide">
            Your channel
          </span>
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor:
                  channel.state === "active" ? "#16efaa" : "#ffc12c",
                boxShadow:
                  channel.state === "active" ? "0 0 10px #16efaa" : "none",
              }}
            />
            <span
              className="text-[14px] font-medium capitalize"
              style={{
                color: channel.state === "active" ? "#16efaa" : "#ffc12c",
              }}
            >
              {channel.state === "active" ? "Active" : channel.state}
            </span>
          </div>
        </div>

        {/* Asset Rows */}
        <div className="flex flex-col">
          {/* Row 1: Nervos Network (CKB) */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3.5">
              <div className="w-[42px] h-[42px] rounded-full overflow-hidden bg-black flex items-center justify-center shrink-0 border border-white/10 shadow-inner">
                <TokenLogo token="CKB" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[17px] font-semibold text-white leading-tight">
                  Nervos Network
                </span>
                <span className="text-[13px] text-[#8ea096] font-normal mt-0.5">
                  CKB
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end text-right">
              <span className="text-[24px] md:text-[26px] font-bold text-white tracking-tight leading-tight">
                {formatAmount(channel.localCapacity)}
              </span>
              <span className="text-[13px] text-[#8ea096] font-normal mt-0.5">
                CKB
              </span>
            </div>
          </div>

          {/* Row 2: USD Coin (USDC) - Only shown if shared demo state has received USDC from swap */}
          {hasUsdc && (
            <>
              <div className="w-full border-t border-[#1f3128] my-1" />
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-[42px] h-[42px] rounded-full overflow-hidden bg-[#2775ca]/10 flex items-center justify-center shrink-0 border border-white/10">
                    <TokenLogo token="USDC" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[17px] font-semibold text-white leading-tight">
                      USD Coin
                    </span>
                    <span className="text-[13px] text-[#8ea096] font-normal mt-0.5">
                      USDC
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end text-right">
                  <span className="text-[24px] md:text-[26px] font-bold text-white tracking-tight leading-tight">
                    {formatAmount(channel.usdcBalance, 0)}
                  </span>
                  <span className="text-[13px] text-[#8ea096] font-normal mt-0.5">
                    USDC
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-7 flex flex-col items-center">
          {/* Primary Action: Add funds */}
          <button
            type="button"
            onClick={onOpenAddFunds}
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
            Add funds
          </button>

          {/* Secondary Action: Close & withdraw */}
          <button
            type="button"
            onClick={onOpenCloseChannel}
            className="mt-4 text-[14px] font-medium text-[#c6d6ce] hover:text-white transition-colors duration-150 cursor-pointer bg-transparent border-0 p-2"
          >
            Close & withdraw
          </button>

          {/* Helper note */}
          <p className="mt-2 text-[13px] text-[#788a81] text-center font-normal">
            Funding and withdrawals settle on CKB L1.
          </p>

          {/* Collapsible Channel Details Trigger */}
          <button
            type="button"
            onClick={() => setDetailsOpen(!detailsOpen)}
            className="mt-4 flex items-center gap-1.5 text-[12px] font-medium text-[#8ea096] hover:text-[#16efaa] transition-colors bg-[#13221b]/60 px-3 py-1.5 rounded-full border border-[#23352d]/80 cursor-pointer"
            aria-expanded={detailsOpen}
          >
            <span>Channel details</span>
            {detailsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Collapsed Technical Details */}
        {detailsOpen && (
          <div className="mt-4 pt-4 border-t border-[#1f3128] animate-in fade-in duration-200">
            <ChannelDetails channel={channel} />
          </div>
        )}
      </div>

      {/* Small "Get test CKB" link below the card matching screenshot */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onOpenFaucet}
          className="inline-flex items-center gap-1 text-[14px] font-medium text-[#16efaa] hover:underline cursor-pointer bg-transparent border-0"
        >
          <span>Funding options</span>
          <ArrowUpRight size={15} />
        </button>
      </div>
    </div>
  );
}
