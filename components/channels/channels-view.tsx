"use client";

import { useState, useEffect } from "react";
import { ChannelCard } from "./channel-card";
import { UnfundedCard } from "./unfunded-card";
import { ChannelHistory } from "./channel-history";
import { AddFundsModal } from "./add-funds-modal";
import { CloseChannelModal } from "./close-channel-modal";
import { SetupChannelModal } from "./setup-channel-modal";
import { FaucetModal } from "./faucet-modal";
import {
  ChannelData,
  ChannelHistoryItem,
  INITIAL_CHANNEL_DATA,
  INITIAL_CHANNEL_HISTORY,
} from "./types";

import {
  isChannelData,
  isChannelHistory,
  readStoredDemo,
} from "@/lib/channel-storage";

const STORAGE_KEY_CHANNEL = "ckbhedge_channel_data_v1";
const STORAGE_KEY_HISTORY = "ckbhedge_channel_history_v1";

export function ChannelsView() {
  const [channel, setChannel] = useState<ChannelData>(INITIAL_CHANNEL_DATA);
  const [history, setHistory] = useState<ChannelHistoryItem[]>(
    INITIAL_CHANNEL_HISTORY,
  );
  const [mounted, setMounted] = useState<boolean>(false);

  // Modals state
  const [addFundsOpen, setAddFundsOpen] = useState<boolean>(false);
  const [closeChannelOpen, setCloseChannelOpen] = useState<boolean>(false);
  const [setupChannelOpen, setSetupChannelOpen] = useState<boolean>(false);
  const [faucetOpen, setFaucetOpen] = useState<boolean>(false);

  // Load persisted demo state on mount
  useEffect(() => {
    try {
      const savedChannel = readStoredDemo(
        localStorage,
        STORAGE_KEY_CHANNEL,
        isChannelData,
      );
      const savedHistory = readStoredDemo(
        localStorage,
        STORAGE_KEY_HISTORY,
        isChannelHistory,
      );
      if (savedChannel) setChannel(savedChannel);
      if (savedHistory) setHistory(savedHistory);
    } catch {
      // Fallback to initial
    }
    setMounted(true);
  }, []);

  // Save changes
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY_CHANNEL, JSON.stringify(channel));
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch {
      // Ignore storage errors
    }
  }, [channel, history, mounted]);

  // Handler: Add funds
  const handleAddFundsSuccess = (amount: number) => {
    const updatedChannel: ChannelData = {
      ...channel,
      localCapacity: channel.localCapacity + amount,
      walletBalance: Math.max(0, channel.walletBalance - amount),
      state: "active",
    };

    const newEvent: ChannelHistoryItem = {
      id: `ch-hist-${Date.now()}`,
      type: "deposit",
      title: "Funds added to Fiber",
      amountCkb: amount,
      timestamp: "Just now",
      status: "completed",
      txHash: `0x${Math.random().toString(16).slice(2, 8)}…${Math.random().toString(16).slice(2, 6)}`,
      description: "L1 Funding Cell confirmed and channel capacity increased",
    };

    setChannel(updatedChannel);
    setHistory([newEvent, ...history]);
  };

  // Handler: Close channel
  const handleCloseChannelSuccess = () => {
    const returningCkb = channel.localCapacity;
    const returningUsdc = channel.usdcBalance;

    const updatedChannel: ChannelData = {
      ...channel,
      localCapacity: 0,
      usdcBalance: 0,
      walletBalance: channel.walletBalance + returningCkb,
      walletUsdcBalance: channel.walletUsdcBalance + returningUsdc,
      state: "closed",
    };

    const newEvent: ChannelHistoryItem = {
      id: `ch-hist-${Date.now()}`,
      type: "close_and_withdraw",
      title: "Channel closed & settled",
      amountCkb: returningCkb,
      amountUsdc: returningUsdc,
      timestamp: "Just now",
      status: "completed",
      txHash: `0x${Math.random().toString(16).slice(2, 8)}…${Math.random().toString(16).slice(2, 6)}`,
      description:
        "Cooperative close settled on CKB L1; funds unlocked to wallet",
    };

    setChannel(updatedChannel);
    setHistory([newEvent, ...history]);
  };

  // Handler: Setup channel
  const handleSetupChannelSuccess = (amount: number) => {
    const updatedChannel: ChannelData = {
      ...channel,
      localCapacity: amount,
      walletBalance: Math.max(0, channel.walletBalance - amount),
      state: "active",
    };

    const newEvent: ChannelHistoryItem = {
      id: `ch-hist-${Date.now()}`,
      type: "channel_opened",
      title: "Channel opened",
      amountCkb: amount,
      timestamp: "Just now",
      status: "completed",
      txHash: `0x${Math.random().toString(16).slice(2, 8)}…${Math.random().toString(16).slice(2, 6)}`,
      description: "Initial 2-of-2 multisig funding cell confirmed on CKB L1",
    };

    setChannel(updatedChannel);
    setHistory([newEvent, ...history]);
  };

  // Handler: Faucet claim
  const handleClaimDemoCkb = (amount: number) => {
    setChannel((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance + amount,
    }));
  };

  return (
    <div className="w-full min-h-[calc(100vh-180px)] flex flex-col items-center justify-start py-8 md:py-14 px-4 relative">
      {/* Main Channel Card (Active or Unfunded) */}
      {channel.state === "active" ? (
        <ChannelCard
          channel={channel}
          onOpenAddFunds={() => setAddFundsOpen(true)}
          onOpenCloseChannel={() => setCloseChannelOpen(true)}
          onOpenFaucet={() => setFaucetOpen(true)}
        />
      ) : (
        <UnfundedCard
          channel={channel}
          onOpenSetup={() => setSetupChannelOpen(true)}
          onOpenFaucet={() => setFaucetOpen(true)}
        />
      )}

      {/* History section below card */}
      <ChannelHistory history={history} />

      {/* Modals */}
      <AddFundsModal
        open={addFundsOpen}
        onClose={() => setAddFundsOpen(false)}
        channel={channel}
        onSuccess={handleAddFundsSuccess}
      />

      <CloseChannelModal
        open={closeChannelOpen}
        onClose={() => setCloseChannelOpen(false)}
        channel={channel}
        onSuccess={handleCloseChannelSuccess}
      />

      <SetupChannelModal
        open={setupChannelOpen}
        onClose={() => setSetupChannelOpen(false)}
        channel={channel}
        onSuccess={handleSetupChannelSuccess}
      />

      <FaucetModal
        open={faucetOpen}
        onClose={() => setFaucetOpen(false)}
        walletBalance={channel.walletBalance}
        onClaimDemoCkb={handleClaimDemoCkb}
      />
    </div>
  );
}
