import { ChannelsView } from "@/components/channels/channels-view";

export const metadata = {
  title: "Channels — CKBHedge",
  description:
    "Manage your off-chain Fiber payment channels for zero-gas instant hedging.",
};

export default function ChannelsPage() {
  return <ChannelsView />;
}
