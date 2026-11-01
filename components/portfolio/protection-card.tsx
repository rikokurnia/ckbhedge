'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, ArrowUpRight } from 'lucide-react';
import styles from './portfolio.module.css';
import { type ActiveProtectionData } from './types';
import { formatAmount } from '@/lib/demo';
import { Dialog, Button } from '@/components/shared/ui';

interface ProtectionCardProps {
  protection: ActiveProtectionData | null;
  onTogglePause: () => void;
  onRevoke: () => void;
  onRestore: () => void;
}

function AmberShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2Z" fill="#ffc12c" />
      <path d="M9 12L11 14L15.5 9.5" stroke="#07100d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PausedShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2Z" fill="#889891" />
      <path d="M10 9V15M14 9V15" stroke="#07100d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ProtectionCard({
  protection,
  onTogglePause,
  onRevoke,
  onRestore,
}: ProtectionCardProps) {
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);

  const isPaused = protection?.status === 'paused';

  return (
    <>
      <div className={styles.protectionCard}>
        <div className={styles.protectionHeader}>
          <h2 className={styles.protectionHeaderLeft}>Active protection</h2>

          <div className={styles.protectionHeaderRight}>
            {protection && (
              <>
                <span className={styles.shieldIconWrap}>
                  {isPaused ? <PausedShieldIcon /> : <AmberShieldIcon />}
                </span>
                <span className={isPaused ? styles.pausedBadge : styles.monitoringBadge}>
                  {isPaused ? 'Paused' : 'Monitoring'}
                </span>
              </>
            )}
          </div>
        </div>

        {!protection ? (
          <div className={styles.emptyStateContainer}>
            <Shield size={36} style={{ color: '#b1bdc6', opacity: 0.7 }} />
            <p className={styles.emptyStateTitle}>No active protection</p>
            <p className={styles.emptyStateText}>
              Set up automated downside protection on your CKB holdings to avoid market drops without paying L1 gas or waiting for mempool confirmation.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/trade?mode=protect" className={styles.manageBtn}>
                Set up protection <ArrowUpRight size={18} style={{ marginLeft: 6 }} />
              </Link>
              <button
                type="button"
                onClick={onRestore}
                className={styles.pauseBtn}
                style={{ padding: '8px 16px', fontSize: 14 }}
              >
                Restore demo rule
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.protectionBody}>
            <div className={styles.protectionTitleRow}>
              <h3 className={styles.protectionTitle}>{protection.title}</h3>
              <span className={styles.experimentalTag}>{protection.badge}</span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Asset</span>
              <span className={styles.detailValue}>{protection.pair}</span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Amount</span>
              <span className={styles.detailValue}>{formatAmount(protection.amountCkb)} CKB</span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Safety floor</span>
              <span className={styles.detailValue}>{protection.safetyFloorUsdc.toFixed(5)} USDC</span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Authorization remaining</span>
              <span className={styles.detailValue}>{protection.authRemainingText}</span>
            </div>

            <div className={styles.protectionActions}>
              <Link
                href="/trade?mode=protect"
                className={styles.manageBtn}
                title="Manage rule parameters in Trade terminal"
              >
                Manage rule
              </Link>

              <button
                type="button"
                className={styles.pauseBtn}
                onClick={onTogglePause}
                aria-label={isPaused ? 'Resume protection rule' : 'Pause protection rule'}
              >
                {isPaused ? 'Resume' : 'Pause'}
              </button>
            </div>

            <button
              type="button"
              className={styles.revokeLink}
              onClick={() => setShowRevokeDialog(true)}
            >
              Revoke authorization
            </button>
          </div>
        )}
      </div>

      {/* Revoke Confirmation Dialog */}
      <Dialog
        open={showRevokeDialog}
        onClose={() => setShowRevokeDialog(false)}
        title="Revoke protection authorization?"
      >
        <p className={styles.dialogDescription}>
          This will immediately revoke the delegated JoyID session key in your browser. The automated downside protection rule for <strong>25,000 CKB</strong> will be cancelled, and no swap will execute if CKB drops below the $0.01150 safety floor.
        </p>
        <div className={styles.dialogRow}>
          <span className={styles.dialogRowLabel}>Active rule</span>
          <span className={styles.dialogRowValue}>AI downside protection (CKB → USDC)</span>
        </div>
        <div className={styles.dialogRow}>
          <span className={styles.dialogRowLabel}>Protected amount</span>
          <span className={styles.dialogRowValue}>25,000 CKB</span>
        </div>
        <div className={styles.dialogRow}>
          <span className={styles.dialogRowLabel}>Delegation</span>
          <span className={styles.dialogRowValue}>JoyID Session Key</span>
        </div>

        <div className={styles.dialogButtonRow}>
          <Button
            variant="secondary"
            onClick={() => setShowRevokeDialog(false)}
            style={{ flex: 1 }}
          >
            Keep active
          </Button>
          <Button
            style={{ flex: 1, background: '#ff505a', color: '#fff' }}
            onClick={() => {
              onRevoke();
              setShowRevokeDialog(false);
            }}
          >
            Confirm revoke
          </Button>
        </div>
      </Dialog>
    </>
  );
}
