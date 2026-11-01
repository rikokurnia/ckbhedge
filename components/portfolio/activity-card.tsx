'use client';

import { useState } from 'react';
import styles from './portfolio.module.css';
import { type ActivityEvent } from './types';
import { ActivityDetailsDialog } from './activity-details-dialog';

interface ActivityCardProps {
  activities: ActivityEvent[];
}

export function ActivityCard({ activities }: ActivityCardProps) {
  const [selectedActivity, setSelectedActivity] = useState<ActivityEvent | null>(null);

  return (
    <>
      <div className={styles.activityCard}>
        <div className={styles.activityHeader}>
          <h2 className={styles.cardTitle} style={{ margin: 0 }}>
            Recent activity
          </h2>
        </div>

        {activities.length === 0 ? (
          <div className={styles.emptyStateContainer}>
            <p className={styles.emptyStateTitle}>No recent activity</p>
            <p className={styles.emptyStateText}>
              There are no transactions or protection events recorded yet. Swaps, funding, and rule authorizations will appear here.
            </p>
          </div>
        ) : (
          <div className={styles.activityTableWrapper}>
            <table className={styles.activityTable}>
              <thead>
                <tr>
                  <th className={styles.activityHeaderCell} style={{ width: '80px' }}>
                    Time
                  </th>
                  <th className={styles.activityHeaderCell}>Action</th>
                  <th className={styles.activityHeaderCell}>Amount</th>
                  <th className={styles.activityHeaderCell}>Status</th>
                  <th className={styles.activityHeaderCell} style={{ textAlign: 'right' }}>
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {activities.map((act) => (
                  <tr key={act.id} className={styles.activityRow}>
                    <td className={`${styles.activityCell} ${styles.activityCellTime}`}>
                      {act.time}
                    </td>
                    <td className={`${styles.activityCell} ${styles.activityCellAction}`}>
                      <div className={styles.actionContent}>
                        {act.tag === 'Fiber' && (
                          <span className={styles.badgeFiber}>Fiber</span>
                        )}
                        {act.tag === 'L1' && (
                          <span className={styles.badgeL1}>L1</span>
                        )}
                        <span>{act.action}</span>
                      </div>
                    </td>
                    <td className={`${styles.activityCell} ${styles.activityCellAmount}`}>
                      {act.amount}
                    </td>
                    <td className={`${styles.activityCell} ${styles.activityCellStatus}`}>
                      <div className={styles.statusIndicator}>
                        {act.statusType === 'completed' && (
                          <>
                            <span className={styles.statusDotGreen} aria-hidden="true" />
                            <span className={styles.statusTextGreen}>{act.status}</span>
                          </>
                        )}
                        {act.statusType === 'active' && (
                          <>
                            <span className={styles.statusDotAmber} aria-hidden="true" />
                            <span className={styles.statusTextAmber}>{act.status}</span>
                          </>
                        )}
                        {act.statusType === 'confirmed' && (
                          <>
                            <span className={styles.statusDotGrey} aria-hidden="true" />
                            <span className={styles.statusTextGrey}>{act.status}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className={`${styles.activityCell} ${styles.activityCellDetails}`}>
                      <button
                        type="button"
                        className={styles.viewButton}
                        onClick={() => setSelectedActivity(act)}
                        aria-label={`View details for ${act.action}`}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ActivityDetailsDialog
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />
    </>
  );
}
