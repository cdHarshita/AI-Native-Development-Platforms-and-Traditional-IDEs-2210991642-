import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";
import { signToken } from "@/lib/jwt";
import { COOKIE_NAME } from "@/lib/auth";
import { ApiResponse, User } from "@/types";

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<User>>> {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const { data: row } = await supabaseAdmin
      .from("users")
      .select("id, email, name, role, created_at, password_hash")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (!row) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, row.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const user: User = {
      id: row.id,
      email: row.email,
      name: row.name,
      role: row.role,
      created_at: row.created_at,
    };

    const token = await signToken({ sub: user.id, email: user.email, name: user.name, role: user.role });

    const res = NextResponse.json({ data: user });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
