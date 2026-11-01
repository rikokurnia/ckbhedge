'use client';

import { useState } from 'react';
import { balances as defaultBalances } from '@/lib/demo';
import styles from './portfolio.module.css';
import {
  type PortfolioAsset,
  type ActiveProtectionData,
  type ActivityEvent,
  INITIAL_PROTECTION_DATA,
  INITIAL_ACTIVITY_LIST,
} from './types';
import { LeftMetricCards, RightMetricCard } from './metric-cards';
import { AssetsCard } from './assets-card';
import { ProtectionCard } from './protection-card';
import { ActivityCard } from './activity-card';
import { Dialog, Button } from '@/components/shared/ui';

export function PortfolioView() {
  const [useEmptyState, setUseEmptyState] = useState(false);
  const [protection, setProtection] = useState<ActiveProtectionData | null>(INITIAL_PROTECTION_DATA);
  const [activities, setActivities] = useState<ActivityEvent[]>(INITIAL_ACTIVITY_LIST);
  const [showDemoInfoDialog, setShowDemoInfoDialog] = useState(false);

  // Compute assets from balances
  const rawBalances = useEmptyState
    ? [
        { token: 'CKB' as const, channel: 0, wallet: 0, usdPrice: 0.0125 },
        { token: 'USDC' as const, channel: 0, wallet: 0, usdPrice: 1 },
      ]
    : defaultBalances;

  const assets: PortfolioAsset[] = rawBalances.map((b) => {
    const estUsdValue = b.channel * b.usdPrice;
    return {
      token: b.token,
      name: b.token === 'CKB' ? 'Nervos Network' : 'USD Coin',
      channelBalance: b.channel,
      walletBalance: b.wallet,
      referencePrice: b.usdPrice,
      estUsdValue,
      allocationPercent: 0, // Computed below
    };
  });

  const totalUsdValue = assets.reduce((sum, a) => sum + a.estUsdValue, 0);

  // Recalculate allocation percentage
  assets.forEach((a) => {
    a.allocationPercent = totalUsdValue > 0 ? (a.estUsdValue / totalUsdValue) * 100 : 0;
  });

  const ckbAsset = assets.find((a) => a.token === 'CKB');
  const usdcAsset = assets.find((a) => a.token === 'USDC');

  const ckbPercent = ckbAsset ? ckbAsset.allocationPercent : 71.4;
  const usdcPercent = usdcAsset ? usdcAsset.allocationPercent : 28.6;

  const hasAssets = totalUsdValue > 0;
  const hasProtection = protection !== null && protection.status !== 'revoked';

  const protectedCkbAmount = hasProtection ? protection.amountCkb : 0;
  const protectedPercentOfCkb =
    hasProtection && ckbAsset && ckbAsset.channelBalance > 0
      ? Math.round((protectedCkbAmount / ckbAsset.channelBalance) * 100)
      : 0;

  // Handlers for protection interactions
  const handleTogglePause = () => {
    if (!protection) return;
    setProtection((prev) => {
      if (!prev) return null;
      const nextStatus = prev.status === 'monitoring' ? 'paused' : 'monitoring';
      return { ...prev, status: nextStatus };
    });
  };

  const handleRevoke = () => {
    setProtection(null);
  };

  const handleRestoreProtection = () => {
    setProtection(INITIAL_PROTECTION_DATA);
  };

  const handleToggleEmptyState = () => {
    if (useEmptyState) {
      setUseEmptyState(false);
      setProtection(INITIAL_PROTECTION_DATA);
    } else {
      setUseEmptyState(true);
      setProtection(null);
    }
    setShowDemoInfoDialog(false);
  };

  return (
    <div className={styles.portfolioContainer}>
      {/* Page Header */}
      <div className={styles.headerRow}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Portfolio</h1>
          <p className={styles.subtitle}>Your balances and active protection.</p>
        </div>

        <button
          type="button"
          className={styles.illustrativePill}
          onClick={() => setShowDemoInfoDialog(true)}
          title="Click to view simulation details or preview empty states"
        >
          Illustrative balances
        </button>
      </div>

      {/* Main Grid: Left Column & Right Column */}
      <div className={styles.mainGrid}>
        {/* Left Column: Top 2 Metric Cards + Assets Card */}
        <div className={styles.leftColumn}>
          <LeftMetricCards
            totalUsdValue={totalUsdValue}
            ckbExposurePercent={ckbPercent}
            hasAssets={hasAssets}
          />

          <AssetsCard
            assets={assets}
            ckbPercent={ckbPercent}
            usdcPercent={usdcPercent}
          />
        </div>

        {/* Right Column: Protection Allocated Metric Card + Active Protection Card */}
        <div className={styles.rightColumn}>
          <RightMetricCard
            protectedCkbAmount={protectedCkbAmount}
            protectedPercentOfCkb={protectedPercentOfCkb}
            hasProtection={hasProtection}
          />

          <ProtectionCard
            protection={protection}
            onTogglePause={handleTogglePause}
            onRevoke={handleRevoke}
            onRestore={handleRestoreProtection}
          />
        </div>
      </div>

      {/* Bottom Full-Width Row: Recent Activity */}
      <ActivityCard activities={useEmptyState ? [] : activities} />

      {/* Demo Information Dialog */}
      <Dialog
        open={showDemoInfoDialog}
        onClose={() => setShowDemoInfoDialog(false)}
        title="Illustrative Portfolio Balances"
      >
        <p className={styles.dialogDescription}>
          This portfolio displays simulated Fiber Network channel balances, reference market prices, and active session-key protection rules. All data is for prototype demonstration.
        </p>

        <div className={styles.dialogRow}>
          <span className={styles.dialogRowLabel}>Fiber Channel</span>
          <span className={styles.dialogRowValueMono}>demo-fiber-01</span>
        </div>
        <div className={styles.dialogRow}>
          <span className={styles.dialogRowLabel}>Network</span>
          <span className={styles.dialogRowValue}>CKB Testnet (Pudge) → Fiber</span>
        </div>
        <div className={styles.dialogRow}>
          <span className={styles.dialogRowLabel}>Current View</span>
          <span className={styles.dialogRowValue}>
            {useEmptyState ? 'Empty State Preview' : 'Active Prototype (Screenshot Match)'}
          </span>
        </div>

        <div className={styles.dialogButtonRow}>
          <Button
            variant="secondary"
            onClick={handleToggleEmptyState}
            style={{ flex: 1 }}
          >
            {useEmptyState ? 'Switch to default state' : 'Preview empty state'}
          </Button>
          <Button
            onClick={() => setShowDemoInfoDialog(false)}
            style={{ flex: 1 }}
          >
            Close
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
