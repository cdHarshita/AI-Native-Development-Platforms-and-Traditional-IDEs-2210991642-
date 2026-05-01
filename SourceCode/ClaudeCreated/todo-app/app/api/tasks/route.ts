import { NextRequest, NextResponse } from "next/server";
import { getTasks, createTask } from "@/lib/storage";
import { CreateTaskPayload, ApiResponse, Task } from "@/types";
import { v4 as uuidv4 } from "uuid";

// GET /api/tasks — return all tasks from localStorage (server reads from client via body in real apps;
// here the API acts as a validation/transformation layer; actual persistence is client-side localStorage)
export async function GET(): Promise<NextResponse<ApiResponse<Task[]>>> {
  // In a fully client-side localStorage setup the browser is the source of truth.
  // This endpoint returns an empty array as a fallback; the client always hydrates from localStorage.
  return NextResponse.json({ data: [] });
}

// POST /api/tasks — validate and return a new task object for the client to persist
export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse<Task>>> {
  try {
    const body = (await req.json()) as CreateTaskPayload;

    if (!body.title || typeof body.title !== "string" || body.title.trim().length === 0) {
      return NextResponse.json(
        { error: "Title is required and must be a non-empty string." },
        { status: 400 }
      );
    }

    if (body.title.trim().length > 200) {
      return NextResponse.json(
        { error: "Title must be 200 characters or fewer." },
        { status: 400 }
      );
    }

    if (body.description && body.description.length > 500) {
      return NextResponse.json(
        { error: "Description must be 500 characters or fewer." },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const task: Task = {
      id: uuidv4(),
      title: body.title.trim(),
      description: body.description?.trim() || undefined,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    return NextResponse.json({ data: task }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
}
