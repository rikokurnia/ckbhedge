"use client";

import { useState } from "react";
import { Copy, Check, ShieldCheck, Cpu, ArrowRightLeft } from "lucide-react";
import { ChannelData } from "./types";
import { formatAmount } from "@/lib/demo";

interface ChannelDetailsProps {
  channel: ChannelData;
}

export function ChannelDetails({ channel }: ChannelDetailsProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [copyError, setCopyError] = useState(false);
  const handleCopy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopyError(false);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      setCopyError(true);
    }
  };

  return (
    <div className="flex flex-col gap-3 text-[13px] text-[#8ea096]">
      {copyError && (
        <p role="status">
          Clipboard unavailable. Select and copy the displayed value instead.
        </p>
      )}
      <div className="flex items-center justify-between py-1">
        <span className="flex items-center gap-1.5 text-[#c6d6ce]">
          <Cpu size={14} className="text-[#16efaa]" />
          Channel ID
        </span>
        <div className="flex items-center gap-1.5 font-mono text-[12px] text-white">
          <span>{channel.id}</span>
          <button
            type="button"
            onClick={() => handleCopy("id", channel.channelIdHex)}
            className="text-[#8ea096] hover:text-[#16efaa] transition-colors p-1 cursor-pointer bg-transparent border-0"
            title="Copy channel hex hash"
          >
            {copiedKey === "id" ? (
              <Check size={13} className="text-[#16efaa]" />
            ) : (
              <Copy size={13} />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between py-1">
        <span className="flex items-center gap-1.5 text-[#c6d6ce]">
          <ArrowRightLeft size={14} className="text-[#16efaa]" />
          Peer Node
        </span>
        <div className="flex items-center gap-1.5 font-mono text-[12px] text-white">
          <span>
            {channel.peerNodeId.slice(0, 8)}…{channel.peerNodeId.slice(-6)}
          </span>
          <button
            type="button"
            onClick={() => handleCopy("peer", channel.peerNodeId)}
            className="text-[#8ea096] hover:text-[#16efaa] transition-colors p-1 cursor-pointer bg-transparent border-0"
            title="Copy peer node ID"
          >
            {copiedKey === "peer" ? (
              <Check size={13} className="text-[#16efaa]" />
            ) : (
              <Copy size={13} />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between py-1">
        <span className="text-[#c6d6ce]">Local capacity</span>
        <span className="font-semibold text-white">
          {formatAmount(channel.localCapacity)} CKB
        </span>
      </div>

      <div className="flex items-center justify-between py-1">
        <span className="text-[#c6d6ce]">Remote inbound liquidity</span>
        <span className="font-semibold text-white">
          {formatAmount(channel.remoteCapacity)} USDC
        </span>
      </div>

      <div className="flex items-center justify-between py-1">
        <span className="text-[#c6d6ce]">Settlement script</span>
        <span className="font-mono text-[12px] text-[#16efaa] flex items-center gap-1">
          <ShieldCheck size={13} />
          2-of-2 Multi-Sig Commitment
        </span>
      </div>

      <div className="flex items-center justify-between py-1">
        <span className="text-[#c6d6ce]">Off-chain latency</span>
        <span className="text-white">
          &lt; {channel.latencyMs}ms (0 L1 Gas Fee)
        </span>
      </div>

      <div className="flex items-center justify-between py-1">
        <span className="text-[#c6d6ce]">Network</span>
        <span className="text-white">Nervos Fiber Testnet (Pudge)</span>
      </div>
    </div>
  );
}
