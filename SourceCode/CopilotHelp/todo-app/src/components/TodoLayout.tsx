import React from 'react';
import styles from './TodoLayout.module.css';

interface Props {
  children: React.ReactNode;
  totalStats?: React.ReactNode;
}

export default function TodoLayout({ children, totalStats }: Props) {
  return (
    <main className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.eyebrow}>Workspace</span>
          <h1 className={styles.title}>Tasks</h1>
        </div>
        
        {totalStats && (
          <div className={styles.stats}>
            <div className={styles.statsDot}></div>
            {totalStats}
          </div>
        )}
      </header>
      
      <div className={styles.card}>
        {children}
      </div>
    </main>
  );
}
