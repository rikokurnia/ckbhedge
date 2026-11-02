import type {
  ChannelData,
  ChannelHistoryItem,
} from "@/components/channels/types";

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function nonNegativeNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}
export function isChannelData(value: unknown): value is ChannelData {
  if (!record(value)) return false;
  return (
    ["id", "peerNodeId", "channelIdHex", "l1Address"].every(
      (key) => typeof value[key] === "string" && value[key].length > 0,
    ) &&
    [
      "localCapacity",
      "remoteCapacity",
      "usdcBalance",
      "walletBalance",
      "walletUsdcBalance",
      "latencyMs",
    ].every((key) => nonNegativeNumber(value[key])) &&
    ["active", "opening", "closing", "closed"].includes(
      value.state as string,
    ) &&
    value.network === "testnet"
  );
}
export function isChannelHistory(
  value: unknown,
): value is ChannelHistoryItem[] {
  return (
    Array.isArray(value) &&
    value.every((item) => {
      if (!record(item)) return false;
      return (
        ["id", "title", "timestamp", "txHash", "description"].every(
          (key) => typeof item[key] === "string",
        ) &&
        nonNegativeNumber(item.amountCkb) &&
        (item.amountUsdc === undefined || nonNegativeNumber(item.amountUsdc)) &&
        ["channel_opened", "deposit", "close_and_withdraw"].includes(
          item.type as string,
        ) &&
        ["completed", "pending", "failed"].includes(item.status as string)
      );
    })
  );
}

/** Stored browser data is untrusted, including valid JSON with an obsolete shape. */
export function readStoredDemo<T>(
  storage: Pick<Storage, "getItem">,
  key: string,
  validate: (value: unknown) => value is T,
): T | null {
  try {
    const raw = storage.getItem(key);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    return validate(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
