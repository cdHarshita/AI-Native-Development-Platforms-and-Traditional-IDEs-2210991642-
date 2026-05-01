import { Task } from "@/types";

const STORAGE_KEY = "todo_app_tasks_v1";

export function getTasks(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Task[];
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    console.error("Failed to save tasks to localStorage");
  }
}

export function getTaskById(id: string): Task | undefined {
  return getTasks().find((t) => t.id === id);
}

export function createTask(task: Task): Task[] {
  const tasks = getTasks();
  const updated = [task, ...tasks];
  saveTasks(updated);
  return updated;
}

export function updateTask(id: string, patch: Partial<Task>): Task[] {
  const tasks = getTasks();
  const updated = tasks.map((t) =>
    t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t
  );
  saveTasks(updated);
  return updated;
}

export function deleteTask(id: string): Task[] {
  const tasks = getTasks();
  const updated = tasks.filter((t) => t.id !== id);
  saveTasks(updated);
  return updated;
}

export function clearCompleted(): Task[] {
  const tasks = getTasks();
  const updated = tasks.filter((t) => !t.completed);
  saveTasks(updated);
  return updated;
}
