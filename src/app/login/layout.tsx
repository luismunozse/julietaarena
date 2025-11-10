import { ReactNode } from 'react'
import styles from './layout.module.css'

interface LoginLayoutProps {
  children: ReactNode
}

export default function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <div className={styles.loginLayoutWrapper}>
      {children}
    </div>
  )
}
