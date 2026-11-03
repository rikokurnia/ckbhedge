"use client";

import { useState } from "react";
import { Button, Dialog } from "@/components/shared/ui";
import { formatAmount } from "@/lib/demo";

interface FaucetModalProps {
  open: boolean;
  onClose: () => void;
  walletBalance: number;
  onClaimDemoCkb: (amount: number) => void;
}
export function FaucetModal({
  open,
  onClose,
  walletBalance,
  onClaimDemoCkb,
}: FaucetModalProps) {
  const [updated, setUpdated] = useState(false);
  return (
    <Dialog
      open={open}
      onClose={() => {
        setUpdated(false);
        onClose();
      }}
      title="Wallet funding"
    >
      <p className="muted">Manage the CKB balance in your workspace.</p>
      <div className="balance-row">
        <span>Workspace balance</span>
        <strong>{formatAmount(walletBalance)} CKB</strong>
      </div>
      {updated && <p role="status">Workspace balance updated.</p>}
      <Button
        onClick={() => {
          onClaimDemoCkb(10000);
          setUpdated(true);
        }}
      >
        Add 10,000 CKB to workspace
      </Button>
    </Dialog>
  );
}
