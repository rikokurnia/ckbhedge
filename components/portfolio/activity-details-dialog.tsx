'use client';

import { Dialog, Button } from '@/components/shared/ui';
import styles from './portfolio.module.css';
import { type ActivityEvent } from './types';

interface ActivityDetailsDialogProps {
  activity: ActivityEvent | null;
  onClose: () => void;
}

export function ActivityDetailsDialog({ activity, onClose }: ActivityDetailsDialogProps) {
  if (!activity) return null;

  return (
    <Dialog
      open={!!activity}
      onClose={onClose}
      title={activity.details.title}
    >
      <p className={styles.dialogDescription}>{activity.details.description}</p>

      <div>
        <div className={styles.dialogRow}>
          <span className={styles.dialogRowLabel}>Time</span>
          <span className={styles.dialogRowValue}>{activity.time} UTC</span>
        </div>
        <div className={styles.dialogRow}>
          <span className={styles.dialogRowLabel}>Action</span>
          <span className={styles.dialogRowValue}>{activity.action}</span>
        </div>
        <div className={styles.dialogRow}>
          <span className={styles.dialogRowLabel}>Amount</span>
          <span className={styles.dialogRowValue}>{activity.amount}</span>
        </div>
        <div className={styles.dialogRow}>
          <span className={styles.dialogRowLabel}>Status</span>
          <span className={styles.dialogRowValue}>{activity.status}</span>
        </div>

        {activity.details.rows.map((row) => (
          <div key={row.label} className={styles.dialogRow}>
            <span className={styles.dialogRowLabel}>{row.label}</span>
            <span
              className={`${styles.dialogRowValue} ${
                row.isMono ? styles.dialogRowValueMono : ''
              }`}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24 }}>
        <Button onClick={onClose} style={{ width: '100%' }}>
          Close
        </Button>
      </div>
    </Dialog>
  );
}
