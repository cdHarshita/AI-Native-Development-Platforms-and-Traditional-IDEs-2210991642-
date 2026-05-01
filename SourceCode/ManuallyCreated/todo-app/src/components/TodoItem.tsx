'use client';

import React from 'react';
import styles from './TodoItem.module.css';
import type { Todo } from '../types/todo';

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <li className={styles.item} onClick={() => onToggle(todo.id)}>
      {/* Checkbox */}
      <div className={`${styles.check} ${todo.completed ? styles.done : ''}`}>
        <svg className={styles.checkIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {/* Text */}
      <span className={`${styles.text} ${todo.completed ? styles.done : ''}`}>
        {todo.text}
      </span>

      {/* Delete */}
      <button
        className={styles.del}
        onClick={(e) => { e.stopPropagation(); onDelete(todo.id); }}
        aria-label="Delete task"
      >
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </li>
  );
}
