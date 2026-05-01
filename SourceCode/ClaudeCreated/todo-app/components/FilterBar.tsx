"use client";

import { FilterType } from "@/types";

interface FilterBarProps {
  current: FilterType;
  counts: { all: number; active: number; completed: number };
  onChange: (filter: FilterType) => void;
}

const FILTERS: { key: FilterType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
];

export default function FilterBar({ current, counts, onChange }: FilterBarProps) {
  return (
    <div className="flex gap-1 px-5 py-2.5 bg-gray-50 dark:bg-slate-800/60 border-b border-gray-100 dark:border-slate-700">
      {FILTERS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            current === key
              ? "bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100 shadow-sm border border-gray-200 dark:border-slate-600"
              : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
          }`}
        >
          {label}
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              current === key
                ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400"
                : "bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500"
            }`}
          >
            {counts[key]}
          </span>
        </button>
      ))}
    </div>
  );
}
