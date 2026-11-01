export type TokenSymbol = "CKB" | "USDC";
export interface Balance {
  token: TokenSymbol;
  channel: number;
  wallet: number;
  usdPrice: number;
}
export interface ChannelStatus {
  id: string;
  state: "opening" | "active" | "closing" | "closed";
  localCapacity: number;
  remoteCapacity: number;
  latencyMs: number;
  network: "testnet";
}
export interface ProtectionRule {
  id: string;
  type: "stop-loss" | "trailing-stop" | "ai-signal" | "manual";
  amount: number;
  triggerPrice?: number;
  trailingPercent?: number;
  execution: "notify" | "automatic";
  spendingLimit: number;
  expiresAt: string;
  status: "active" | "completed" | "paused";
  demo: true;
}
export interface Activity {
  id: string;
  type: "swap" | "protection" | "funding";
  timestamp: string;
  from: TokenSymbol;
  to: TokenSymbol;
  amount: number;
  received: number;
  status: "completed" | "pending";
  demo: true;
}
export const balances: Balance[] = [
  { token: "CKB", channel: 50000, wallet: 12500, usdPrice: 0.0125 },
  { token: "USDC", channel: 250, wallet: 0, usdPrice: 1 },
];
export const channel: ChannelStatus = {
  id: "demo-fiber-01",
  state: "active",
  localCapacity: 50000,
  remoteCapacity: 2500,
  latencyMs: 180,
  network: "testnet",
};
export const protectionRules: ProtectionRule[] = [];
export const activity: Activity[] = [];
export const DEMO_RATE = 0.01248;
export const formatAmount = (n: number, decimals = 0) =>
  n.toLocaleString("en-US", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });
