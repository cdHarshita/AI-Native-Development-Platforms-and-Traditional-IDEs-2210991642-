"use client";

import { useState } from "react";
import { Task } from "@/types";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleToggle() {
    setToggling(true);
    await onToggle(task.id, !task.completed);
    setToggling(false);
  }

  async function handleDelete() {
    setDeleting(true);
    await onDelete(task.id);
    setDeleting(false);
  }

  return (
    <li
      className={`group flex items-start gap-3 px-5 py-4 border-b border-gray-100 dark:border-slate-700/60 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors ${
        deleting ? "opacity-40" : ""
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        disabled={toggling || deleting}
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
        className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-400 ${
          task.completed
            ? "bg-green-500 border-green-500"
            : "border-gray-300 dark:border-slate-500 hover:border-indigo-400"
        }`}
      >
        {task.completed && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
            <path
              d="M1.5 5l2.5 2.5 4.5-4.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-5 break-words ${
            task.completed
              ? "line-through text-gray-400 dark:text-slate-500"
              : "text-gray-800 dark:text-slate-200"
          }`}
        >
          {task.title}
        </p>
        {task.description && (
          <p
            className={`mt-0.5 text-xs leading-4 break-words ${
              task.completed
                ? "text-gray-300 dark:text-slate-600"
                : "text-gray-500 dark:text-slate-400"
            }`}
          >
            {task.description}
          </p>
        )}
      </div>

      {/* Delete button */}
      <button
        onClick={handleDelete}
        disabled={deleting || toggling}
        aria-label="Delete task"
        className="flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 p-1 rounded text-gray-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-all focus:opacity-100 focus:outline-none"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
          <path
            d="M4 4l8 8M12 4l-8 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </li>
  );
}
