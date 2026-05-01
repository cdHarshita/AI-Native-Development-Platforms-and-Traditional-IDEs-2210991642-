"use client";

import { Task, FilterType } from "@/types";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  filter: FilterType;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const EMPTY_MESSAGES: Record<FilterType, string> = {
  all: "No tasks yet — add your first task above.",
  active: "No active tasks. All caught up!",
  completed: "No completed tasks yet.",
};

export default function TaskList({ tasks, filter, onToggle, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-6">
        <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-200 dark:border-slate-700 flex items-center justify-center mb-4">
          <svg className="w-5 h-5 text-gray-300 dark:text-slate-600" fill="none" viewBox="0 0 20 20">
            <path
              d="M10 4v12M4 10h12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <p className="text-sm text-gray-400 dark:text-slate-500">{EMPTY_MESSAGES[filter]}</p>
      </div>
    );
  }

  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  );
}
