import { type TokenSymbol, type Balance } from "@/lib/demo";

export interface PortfolioAsset {
  token: TokenSymbol;
  name: string;
  channelBalance: number;
  walletBalance: number;
  referencePrice: number;
  estUsdValue: number;
  allocationPercent: number;
}

export type ProtectionStatus = "monitoring" | "paused" | "revoked";

export interface ActiveProtectionData {
  id: string;
  title: string;
  badge: string;
  pair: string;
  amountCkb: number;
  percentOfCkb: number;
  safetyFloorUsdc: number;
  authRemainingText: string;
  status: ProtectionStatus;
  executionMode: "automatic" | "notify";
  spendingLimitCkb: number;
}

export type ActivityTag = "Fiber" | "L1";
export type ActivityStatusType = "completed" | "active" | "confirmed";

export interface ActivityDetailRow {
  label: string;
  value: string;
  isMono?: boolean;
}

export interface ActivityEvent {
  id: string;
  time: string;
  action: string;
  tag?: ActivityTag;
  amount: string;
  status: string;
  statusType: ActivityStatusType;
  filterCategory: "swap" | "protection" | "funding";
  details: {
    title: string;
    description: string;
    rows: ActivityDetailRow[];
  };
}

export const INITIAL_PROTECTION_DATA: ActiveProtectionData = {
  id: "prot-ai-downside",
  title: "AI downside protection",
  badge: "Experimental",
  pair: "CKB → USDC",
  amountCkb: 25000,
  percentOfCkb: 50,
  safetyFloorUsdc: 0.0115,
  authRemainingText: "18h 42m",
  status: "monitoring",
  executionMode: "automatic",
  spendingLimitCkb: 25000,
};

export const INITIAL_ACTIVITY_LIST: ActivityEvent[] = [
  {
    id: "act-1432",
    time: "14:32",
    action: "Swap CKB → USDC",
    tag: "Fiber",
    amount: "10,000 CKB → 124.80 USDC",
    status: "Completed",
    statusType: "completed",
    filterCategory: "swap",
    details: {
      title: "Fiber InstantSwap",
      description:
        "Off-chain instant swap executed via Fiber Network multi-asset payment channel.",
      rows: [
        { label: "Network", value: "Fiber Network" },
        { label: "Channel ID", value: "0x3a4b91f0...789abcde", isMono: true },
        { label: "Type", value: "Instant Multi-Asset HTLC Swap" },
        { label: "Sold", value: "10,000 CKB" },
        { label: "Received", value: "124.80 USDC" },
        { label: "Effective Rate", value: "1 CKB = 0.01248 USDC" },
        { label: "Settlement Latency", value: "180 ms (Sub-second)" },
        { label: "L1 Gas Fee", value: "0 CKB (0 Gas)" },
        { label: "Status", value: "Completed & Committed" },
      ],
    },
  },
  {
    id: "act-1310",
    time: "13:10",
    action: "Protection authorized",
    amount: "25,000 CKB limit",
    status: "Active",
    statusType: "active",
    filterCategory: "protection",
    details: {
      title: "Downside Protection Authorized",
      description:
        "JoyID delegated session key authorized for automated downside protection.",
      rows: [
        {
          label: "Strategy",
          value: "AI Downside Protection (Floor: $0.01150)",
        },
        { label: "Protected Amount", value: "25,000 CKB (50% of channel)" },
        { label: "Target Asset", value: "USDC" },
        {
          label: "Delegation Type",
          value: "Ephemeral Session Key (Browser AES)",
        },
        { label: "Session Validity", value: "24 Hours (18h 42m remaining)" },
        { label: "Execution Mode", value: "Automatic upon trigger condition" },
        { label: "Signer Origin", value: "JoyID Passkey WebAuthn" },
        { label: "Status", value: "Active & Monitoring" },
      ],
    },
  },
  {
    id: "act-1245",
    time: "12:45",
    action: "Channel funding",
    tag: "L1",
    amount: "60,000 CKB",
    status: "Confirmed on L1",
    statusType: "confirmed",
    filterCategory: "funding",
    details: {
      title: "Layer 1 Channel Funding Cell",
      description:
        "2-of-2 multisig funding transaction confirmed on CKB Layer 1.",
      rows: [
        {
          label: "Transaction Type",
          value: "Fiber Funding Cell Open / Deposit",
        },
        {
          label: "L1 Block Hash",
          value: "0x8f2a49b1c73e04d89ef201...77b2",
          isMono: true,
        },
        { label: "Funding Amount", value: "60,000 CKB" },
        { label: "Lock Script", value: "2-of-2 Multisig (User + LP Node)" },
        { label: "Confirmations", value: "24 Blocks (Settled)" },
        {
          label: "Subsequent Activity",
          value: "10,000 CKB swapped → 50,000 CKB remaining",
        },
        { label: "Status", value: "Confirmed on L1" },
      ],
    },
  },
];
