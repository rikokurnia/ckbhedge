export type ChannelState = "active" | "opening" | "closing" | "closed";

export interface ChannelData {
  id: string;
  state: ChannelState;
  localCapacity: number; // Fiber CKB balance
  remoteCapacity: number; // LP node inbound USDC capacity
  usdcBalance: number; // Fiber USDC balance (hidden if 0)
  walletBalance: number; // CKB in L1 wallet
  walletUsdcBalance: number; // USDC in L1 wallet
  peerNodeId: string;
  channelIdHex: string;
  latencyMs: number;
  network: "testnet";
  l1Address: string;
}

export type ChannelHistoryEventType =
  "channel_opened" | "deposit" | "close_and_withdraw";

export interface ChannelHistoryItem {
  id: string;
  type: ChannelHistoryEventType;
  title: string;
  amountCkb: number;
  amountUsdc?: number;
  timestamp: string;
  status: "completed" | "pending" | "failed";
  txHash: string;
  description: string;
}

export const INITIAL_CHANNEL_DATA: ChannelData = {
  id: "demo-fiber-01",
  state: "active",
  localCapacity: 50000,
  remoteCapacity: 2500,
  usdcBalance: 0, // Initial state has zero USDC -> row hidden per Balance Rules
  walletBalance: 12500,
  walletUsdcBalance: 0,
  peerNodeId: "0x02bf41e2a58b90a42df649f88d223849c71a391e457f0985223efc91a0",
  channelIdHex:
    "0x3a4b91f0084e723653d9e87bbad2c66f91ec4d9a5b6c7d8e0f123456789abcde",
  latencyMs: 180,
  network: "testnet",
  l1Address:
    "ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqwgxm2n4",
};

export const INITIAL_CHANNEL_HISTORY: ChannelHistoryItem[] = [
  {
    id: "ch-hist-1",
    type: "channel_opened",
    title: "Channel opened",
    amountCkb: 50000,
    timestamp: "Nov 1, 2026, 20:15",
    status: "completed",
    txHash: "0x8f2a49b1c73e04d89ef201...77b2",
    description: "Initial 2-of-2 multisig funding cell confirmed on CKB L1",
  },
  {
    id: "ch-hist-2",
    type: "deposit",
    title: "Funding cell settled",
    amountCkb: 50000,
    timestamp: "Nov 1, 2026, 20:14",
    status: "completed",
    txHash: "0x4e7a91c0b3f812aa640c31...9a41",
    description: "L1 block #3,912,480 included funding commitment",
  },
];
