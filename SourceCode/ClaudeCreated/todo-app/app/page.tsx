"use client";

import { useEffect, useState, useCallback } from "react";
import { Task, FilterType } from "@/types";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask as deleteTaskFromStorage,
  clearCompleted,
} from "@/lib/storage";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import FilterBar from "@/components/FilterBar";

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTasks(getTasks());
    setMounted(true);
  }, []);

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const counts = {
    all: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  function handleTaskCreated(task: Task) {
    const updated = createTask(task);
    setTasks(updated);
  }

  const handleToggle = useCallback(async (id: string, completed: boolean) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });
      const json = await res.json();
      if (!res.ok || !json.data) return;
      const updated = updateTask(id, json.data);
      setTasks(updated);
    } catch {
      console.error("Failed to toggle task");
    }
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.data) return;
      const updated = deleteTaskFromStorage(id);
      setTasks(updated);
    } catch {
      console.error("Failed to delete task");
    }
  }, []);

  function handleClearCompleted() {
    const updated = clearCompleted();
    setTasks(updated);
  }

  const remainingCount = counts.active;

  if (!mounted) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-slate-100">
            My Tasks
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
            {tasks.length === 0
              ? "Nothing here yet."
              : `${remainingCount} item${remainingCount !== 1 ? "s" : ""} remaining`}
          </p>
        </div>

        {/* Stats row */}
        <div className="flex gap-2 mb-4">
          {[
            { label: "Total", value: counts.all },
            { label: "Active", value: counts.active },
            { label: "Done", value: counts.completed },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex-1 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl p-3 text-center"
            >
              <p className="text-xl font-semibold text-gray-900 dark:text-slate-100">{value}</p>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Main card */}
        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
          <TaskForm onTaskCreated={handleTaskCreated} />
          <FilterBar current={filter} counts={counts} onChange={setFilter} />
          <TaskList
            tasks={filteredTasks}
            filter={filter}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/60">
            <span className="text-xs text-gray-400 dark:text-slate-500">
              {remainingCount} item{remainingCount !== 1 ? "s" : ""} left
            </span>
            {counts.completed > 0 && (
              <button
                onClick={handleClearCompleted}
                className="text-xs text-gray-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                Clear completed
              </button>
            )}
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-gray-300 dark:text-slate-600">
          Tasks are saved to your browser&apos;s localStorage
        </p>
      </div>
    </main>
  );
}
