import { NextRequest, NextResponse } from "next/server";
import { UpdateTaskPayload, ApiResponse, Task } from "@/types";

type RouteContext = { params: Promise<{ id: string }> };

// PATCH /api/tasks/[id] — validate update payload; client applies to localStorage
export async function PATCH(
  req: NextRequest,
  context: RouteContext
): Promise<NextResponse<ApiResponse<Partial<Task>>>> {
  try {
    const { id } = await context.params;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid task ID." }, { status: 400 });
    }

    const body = (await req.json()) as UpdateTaskPayload;

    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "At least one field must be provided for update." },
        { status: 400 }
      );
    }

    if (body.title !== undefined) {
      if (typeof body.title !== "string" || body.title.trim().length === 0) {
        return NextResponse.json(
          { error: "Title must be a non-empty string." },
          { status: 400 }
        );
      }
      if (body.title.trim().length > 200) {
        return NextResponse.json(
          { error: "Title must be 200 characters or fewer." },
          { status: 400 }
        );
      }
    }

    if (body.description !== undefined && body.description.length > 500) {
      return NextResponse.json(
        { error: "Description must be 500 characters or fewer." },
        { status: 400 }
      );
    }

    if (body.completed !== undefined && typeof body.completed !== "boolean") {
      return NextResponse.json(
        { error: "completed must be a boolean." },
        { status: 400 }
      );
    }

    // Return validated patch for client to apply to localStorage
    const patch: Partial<Task> = {};
    if (body.title !== undefined) patch.title = body.title.trim();
    if (body.description !== undefined) patch.description = body.description.trim() || undefined;
    if (body.completed !== undefined) patch.completed = body.completed;
    patch.updatedAt = new Date().toISOString();

    return NextResponse.json({ data: patch });
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
}

// DELETE /api/tasks/[id] — validate ID; client removes from localStorage
export async function DELETE(
  _req: NextRequest,
  context: RouteContext
): Promise<NextResponse<ApiResponse<{ id: string }>>> {
  try {
    const { id } = await context.params;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid task ID." }, { status: 400 });
    }

    return NextResponse.json({ data: { id } });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
