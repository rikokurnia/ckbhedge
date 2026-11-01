import styles from "./portfolio.module.css";
import { formatAmount } from "@/lib/demo";

interface MetricCardsProps {
  totalUsdValue: number;
  ckbExposurePercent: number;
  protectedCkbAmount: number;
  protectedPercentOfCkb: number;
  hasAssets: boolean;
}

export function LeftMetricCards({
  totalUsdValue,
  ckbExposurePercent,
  hasAssets,
}: {
  totalUsdValue: number;
  ckbExposurePercent: number;
  hasAssets: boolean;
}) {
  return (
    <div className={styles.metricsRow}>
      <div className={styles.metricCard}>
        <div className={styles.metricLabel}>Total channel value</div>
        <div className={styles.metricValue}>
          {hasAssets ? `$${formatAmount(totalUsdValue, 2)}` : "$0.00"}
        </div>
      </div>
      <div className={styles.metricCard}>
        <div className={styles.metricLabel}>CKB exposure</div>
        <div className={styles.metricValue}>
          {hasAssets ? `${ckbExposurePercent.toFixed(1)}%` : "0.0%"}
        </div>
      </div>
    </div>
  );
}

export function RightMetricCard({
  protectedCkbAmount,
  protectedPercentOfCkb,
  hasProtection,
}: {
  protectedCkbAmount: number;
  protectedPercentOfCkb: number;
  hasProtection: boolean;
}) {
  return (
    <div className={styles.metricCard}>
      <div className={styles.metricLabel}>Protection allocated</div>
      <div className={styles.metricValue}>
        {hasProtection ? `${formatAmount(protectedCkbAmount)} CKB` : "0 CKB"}
      </div>
      <div className={styles.metricSubtitle}>
        {hasProtection
          ? `${protectedPercentOfCkb}% of your CKB balance`
          : "No protection active"}
      </div>
    </div>
  );
}
