import React from 'react';
import styles from './TodoLayout.module.css';

export default function TodoLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className={styles.wrapper}>
      <h1 className={styles.title}>Tasks</h1>
      <div className={styles.card}>{children}</div>
    </main>
  );
}
