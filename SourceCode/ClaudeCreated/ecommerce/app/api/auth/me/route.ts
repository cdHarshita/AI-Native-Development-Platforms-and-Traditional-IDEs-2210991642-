import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { ApiResponse, User } from "@/types";

export async function GET(): Promise<NextResponse<ApiResponse<User>>> {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({
    data: { id: user.sub, email: user.email, name: user.name, role: user.role, created_at: "" },
  });
}
