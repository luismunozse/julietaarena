'use client'

import Link from 'next/link'
import { useRecentActivity } from '@/hooks/useRecentActivity'
import styles from './RecentActivity.module.css'

export default function RecentActivity() {
  const { activities, isLoading } = useRecentActivity(8)

  if (isLoading) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Actividad Reciente</h2>
        <div className={styles.activityList}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={styles.activitySkeleton}></div>
          ))}
        </div>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Actividad Reciente</h2>
        <div className={styles.empty}>
          <p>No hay actividad reciente</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Actividad Reciente</h2>
      <div className={styles.activityList}>
        {activities.map((activity) => {
          const content = (
            <>
              <div className={styles.activityIcon}>{activity.icon}</div>
              <div className={styles.activityContent}>
                <h3 className={styles.activityTitle}>{activity.title}</h3>
                <p className={styles.activityDescription}>{activity.description}</p>
                <span className={styles.activityTime}>
                  {(activity as any).formattedTime || 'Hace un momento'}
                </span>
              </div>
            </>
          )

          if (activity.link) {
            return (
              <Link key={activity.id} href={activity.link} className={styles.activityItem}>
                {content}
              </Link>
            )
          }

          return (
            <div key={activity.id} className={styles.activityItem}>
              {content}
            </div>
          )
        })}
      </div>
    </div>
  )
}

