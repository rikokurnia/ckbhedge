"use client";

import { useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Zap,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { ChannelHistoryItem } from "./types";
import { formatAmount } from "@/lib/demo";

interface ChannelHistoryProps {
  history: ChannelHistoryItem[];
}

export function ChannelHistory({ history }: ChannelHistoryProps) {
  const [filter, setFilter] = useState<"all" | "deposits" | "closures">("all");

  const filteredHistory = history.filter((item) => {
    if (filter === "deposits")
      return item.type === "deposit" || item.type === "channel_opened";
    if (filter === "closures") return item.type === "close_and_withdraw";
    return true;
  });

  return (
    <div className="w-full max-w-[500px] mt-8">
      {/* Header & Filter */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-[16px] font-semibold text-white tracking-wide">
          Channel history
        </h2>
        <div className="flex items-center gap-1 bg-[#101c17] p-1 rounded-lg border border-[#23352d]/80 text-[12px]">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-2.5 py-0.5 rounded-md transition-colors cursor-pointer border-0 ${
              filter === "all"
                ? "bg-[#16efaa]/20 text-[#16efaa] font-medium"
                : "text-[#8ea096] hover:text-white bg-transparent"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter("deposits")}
            className={`px-2.5 py-0.5 rounded-md transition-colors cursor-pointer border-0 ${
              filter === "deposits"
                ? "bg-[#16efaa]/20 text-[#16efaa] font-medium"
                : "text-[#8ea096] hover:text-white bg-transparent"
            }`}
          >
            Funding
          </button>
          <button
            type="button"
            onClick={() => setFilter("closures")}
            className={`px-2.5 py-0.5 rounded-md transition-colors cursor-pointer border-0 ${
              filter === "closures"
                ? "bg-[#16efaa]/20 text-[#16efaa] font-medium"
                : "text-[#8ea096] hover:text-white bg-transparent"
            }`}
          >
            Settlement
          </button>
        </div>
      </div>

      {/* History Card Container */}
      <div
        className="w-full rounded-[20px] p-4 shadow-xl backdrop-blur-sm"
        style={{
          background: "rgba(15, 24, 21, 0.85)",
          border: "1px solid #23352d",
        }}
      >
        {filteredHistory.length === 0 ? (
          <div className="py-6 text-center text-[13px] text-[#8ea096]">
            No transactions in this category.
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-[#1f3128]">
            {filteredHistory.map((item) => {
              const isDeposit =
                item.type === "deposit" || item.type === "channel_opened";
              const isClose = item.type === "close_and_withdraw";

              return (
                <div
                  key={item.id}
                  className="py-3 first:pt-1 last:pb-1 flex items-center justify-between gap-3 text-left"
                >
                  {/* Left: Icon & Title */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: isClose
                          ? "rgba(255, 193, 44, 0.12)"
                          : "rgba(22, 239, 170, 0.12)",
                        color: isClose ? "#ffc12c" : "#16efaa",
                      }}
                    >
                      {item.type === "channel_opened" && <Zap size={16} />}
                      {item.type === "deposit" && <ArrowDownLeft size={16} />}
                      {item.type === "close_and_withdraw" && (
                        <ArrowUpRight size={16} />
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-[14px] font-medium text-white truncate">
                        {item.title}
                      </span>
                      <div className="flex items-center gap-2 text-[12px] text-[#8ea096]">
                        <span>{item.timestamp}</span>
                        <span>•</span>
                        <span className="font-mono text-[11px] truncate max-w-[90px] md:max-w-[120px]">
                          {item.txHash}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount & Status Badge */}
                  <div className="flex flex-col items-end shrink-0">
                    <span
                      className="text-[14px] font-semibold"
                      style={{
                        color: isClose ? "#ffc12c" : "#16efaa",
                      }}
                    >
                      {isDeposit ? "+" : "-"}
                      {formatAmount(item.amountCkb)} CKB
                    </span>

                    <span className="flex items-center gap-1 text-[11px] text-[#8ea096] mt-0.5">
                      {item.status === "completed" && (
                        <>
                          <CheckCircle2 size={12} className="text-[#16efaa]" />
                          <span>Settled</span>
                        </>
                      )}
                      {item.status === "pending" && (
                        <>
                          <Clock size={12} className="text-[#ffc12c]" />
                          <span className="text-[#ffc12c]">Pending</span>
                        </>
                      )}
                      {item.status === "failed" && (
                        <>
                          <AlertCircle size={12} className="text-[#ff505a]" />
                          <span className="text-[#ff505a]">Failed</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
