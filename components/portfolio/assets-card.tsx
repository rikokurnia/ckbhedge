"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./portfolio.module.css";
import { type PortfolioAsset } from "./types";
import { formatAmount } from "@/lib/demo";
import { TokenLogo } from "@/components/shared/ui";

interface AssetsCardProps {
  assets: PortfolioAsset[];
  ckbPercent: number;
  usdcPercent: number;
}

export function AssetsCard({
  assets,
  ckbPercent,
  usdcPercent,
}: AssetsCardProps) {
  const hasAssets = assets.some((a) => a.channelBalance > 0);

  return (
    <div className={styles.assetsCard}>
      <h2 className={styles.cardTitle}>Assets</h2>

      {!hasAssets ? (
        <div className={styles.emptyStateContainer}>
          <p className={styles.emptyStateTitle}>No channel assets found</p>
          <p className={styles.emptyStateText}>
            Your Fiber payment channel does not currently hold CKB or USDC. Fund
            your channel to enable sub-second swaps and downside protection.
          </p>
          <Link
            href="/channels"
            className={`${styles.manageBtn} ${styles.emptyStateAction}`}
          >
            Go to Channels <ArrowUpRight size={18} style={{ marginLeft: 6 }} />
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.assetsTableWrapper}>
            <table className={styles.assetsTable}>
              <thead>
                <tr>
                  <th className={styles.tableHeader}>Asset</th>
                  <th className={styles.tableHeader}>Channel balance</th>
                  <th className={styles.tableHeader}>Reference price</th>
                  <th className={styles.tableHeader}>Est. USD value</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset.token} className={styles.assetRow}>
                    <td className={styles.assetCell}>
                      <div className={styles.assetInfo}>
                        <TokenLogo token={asset.token} />
                        <div className={styles.tokenNames}>
                          <span className={styles.tokenFullName}>
                            {asset.name}
                          </span>
                          <span className={styles.tokenSymbol}>
                            {asset.token}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className={styles.assetCell}>
                      {formatAmount(
                        asset.channelBalance,
                        asset.token === "USDC" ? 0 : 0,
                      )}{" "}
                      {asset.token}
                    </td>
                    <td className={styles.assetCell}>
                      $
                      {asset.referencePrice >= 1
                        ? formatAmount(asset.referencePrice, 2)
                        : asset.referencePrice.toFixed(5)}
                    </td>
                    <td
                      className={`${styles.assetCell} ${styles.assetCellBold}`}
                    >
                      ${formatAmount(asset.estUsdValue, 2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.allocationSection}>
            <div
              className={styles.allocationBar}
              role="progressbar"
              aria-label="Asset allocation"
              aria-valuenow={Math.round(ckbPercent)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className={styles.barCkb}
                style={{ width: `${ckbPercent}%` }}
                title={`CKB: ${ckbPercent.toFixed(1)}%`}
              />
              <div
                className={styles.barUsdc}
                style={{ width: `${usdcPercent}%` }}
                title={`USDC: ${usdcPercent.toFixed(1)}%`}
              />
            </div>

            <div className={styles.allocationLegend}>
              <div className={styles.legendItem}>
                <span className={styles.dotCkb} aria-hidden="true" />
                <span>CKB {ckbPercent.toFixed(1)}%</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.dotUsdc} aria-hidden="true" />
                <span>USDC {usdcPercent.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
