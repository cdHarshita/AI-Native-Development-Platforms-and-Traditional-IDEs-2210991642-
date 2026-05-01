'use client';

import React from 'react';
import TodoLayout from '../components/TodoLayout';
import TodoInput from '../components/TodoInput';
import TodoList from '../components/TodoList';
import { useTodos } from '../hooks/useTodos';

export default function Home() {
  const { todos, addTodo, toggleTodo, deleteTodo, isLoaded } = useTodos();

  return (
    <TodoLayout>
      <TodoInput onAdd={addTodo} />
      {isLoaded ? (
        <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
      ) : (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '1.5rem 0' }}>
          Loading…
        </p>
      )}
    </TodoLayout>
  );
}
