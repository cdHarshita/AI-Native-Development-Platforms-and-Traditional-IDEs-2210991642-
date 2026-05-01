import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tasks | Todo App",
  description: "View and manage all your tasks.",
};

// This is a server component that renders the tasks page shell.
// The actual task data is managed client-side via localStorage.
// The interactive client component is loaded from the root page.
export default function TasksPage() {
  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/"
            className="text-sm text-gray-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
              <path
                d="M10 3L5 8l5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to home
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-8 text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-indigo-500" fill="none" viewBox="0 0 24 24">
              <path
                d="M9 12l2 2 4-4M7 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2M7 4a2 2 0 012-2h6a2 2 0 012 2M7 4a2 2 0 000 4h10a2 2 0 000-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2">
            Tasks
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
            All your tasks are managed from the main dashboard. Head back home to add, complete, and organize your tasks.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Go to dashboard
          </Link>
        </div>

        {/* API reference card */}
        <div className="mt-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
            Available API endpoints
          </h2>
          <div className="space-y-2">
            {[
              { method: "GET", path: "/api/tasks", desc: "List all tasks" },
              { method: "POST", path: "/api/tasks", desc: "Create a new task" },
              { method: "PATCH", path: "/api/tasks/:id", desc: "Update a task" },
              { method: "DELETE", path: "/api/tasks/:id", desc: "Delete a task" },
            ].map(({ method, path, desc }) => (
              <div
                key={path + method}
                className="flex items-center gap-3 text-xs font-mono"
              >
                <span
                  className={`px-2 py-0.5 rounded font-medium ${
                    method === "GET"
                      ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                      : method === "POST"
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : method === "PATCH"
                      ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
                      : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                  }`}
                >
                  {method}
                </span>
                <span className="text-gray-600 dark:text-slate-400">{path}</span>
                <span className="text-gray-400 dark:text-slate-500 font-sans">— {desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
